import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';

import { ITokenPayload } from '../infra/interfaces/token_interface';
import { BadRequestError, NotAuthorizedError } from '../utils/error_util';
import { TokenModel } from '../models/token_model';
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from '../utils/token_util';

export interface AuthorizeRequest extends Request {
  user?: ITokenPayload;
}

class TokenMiddleware {
  public authenticate = asyncHandler(async (req: AuthorizeRequest, _res: Response, next: NextFunction): Promise<void> => {
    const bearer = req.header('Authorization');
    if (!bearer) {
      throw new BadRequestError('Authorization header missing', 'TokenMiddleware.authenticate() error');
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      throw new BadRequestError('Unauthorized. Please login to continue.', 'TokenMiddleware.authenticate() error');
    }

    const userAccToken = await TokenModel.findOne({
      where: {
        acc_token: token
      }
    });

    if (!userAccToken) {
      throw new NotAuthorizedError('Unauthorized. Please login to continue.', 'TokenMiddleware.authenticate() error', 'error_auth');
    }
    // Verifikasi access token
    const decodedAccessToken = verifyAccessToken(token);

    if (decodedAccessToken) {
      // Access token valid, simpan data pengguna di req
      req.user = decodedAccessToken;
      const accToken = userAccToken.dataValues?.acc_token;
      if (req.user) {
        req.user.acc_token = accToken;
      }
      return next(); // Lanjutkan ke middleware berikutnya
    }

    // Jika access token expired, periksa refresh token
    const refreshToken = userAccToken.dataValues.ref_token; // Ambil refresh token dari database
    if (!refreshToken) {
      throw new NotAuthorizedError(
        'Refresh token missing. Please login to continue.',
        'TokenMiddleware.authenticate() error',
        'error_auth'
      );
    }

    // Verifikasi refresh token
    const decodedRefreshToken = verifyRefreshToken(refreshToken);
    if (!decodedRefreshToken) {
      throw new NotAuthorizedError('Refresh token expired. Please login again.', 'TokenMiddleware.authenticate() error', 'error_auth');
    }

    // Refresh token valid, buat access token baru
    const newAccessToken = generateAccessToken({ user_id: decodedRefreshToken.user_id });

    // Simpan access token baru di database
    await TokenModel.update({ acc_token: newAccessToken }, { where: { user_id: decodedRefreshToken.user_id } });

    // Kembalikan access token baru di header response
    _res.setHeader('Authorization', `Bearer ${newAccessToken}`);

    // Simpan data pengguna di req untuk digunakan di route berikutnya
    req.user = { user_id: decodedRefreshToken.user_id, acc_token: newAccessToken };

    return next(); // Akses token baru berhasil diperbarui, lanjutkan ke middleware berikutnya
  });
}

export default TokenMiddleware;
