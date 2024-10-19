import jwt, { Secret, JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import { todoConfig } from '../config';
import { ITokenPayload } from '../infra/interfaces/token_interface';

export const TODO_ACCESS_TOKEN_SECRET: Secret = todoConfig.TODO_ACCESS_TOKEN_SECRET as Secret;
export const TODO_REFRESH_TOKEN_SECRET: Secret = todoConfig.TODO_REFRESH_TOKEN_SECRET as Secret;
const TODO_ACCESS_TOKEN_TIME = '30d' as string;
const TODO_REFRESH_TOKEN_TIME = '30d' as string;

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const generateRefreshToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, TODO_REFRESH_TOKEN_SECRET, {
    expiresIn: TODO_REFRESH_TOKEN_TIME
  });
};

export const generateAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, TODO_ACCESS_TOKEN_SECRET, {
    expiresIn: TODO_ACCESS_TOKEN_TIME
  });
};

export const verifyRefreshToken = (refreshToken: string): ITokenPayload | null => {
  try {
    const payload = jwt.verify(refreshToken, TODO_REFRESH_TOKEN_SECRET) as ITokenPayload;
    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      // Token kedaluwarsa
      return null;
    }
    // Kesalahan lainnya
    throw new Error('Invalid token');
  }
};

export const verifyAccessToken = (accessToken: string): ITokenPayload | null => {
  try {
    const payload = jwt.verify(accessToken, TODO_ACCESS_TOKEN_SECRET) as ITokenPayload;
    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      // Token kedaluwarsa
      return null;
    }
    // Kesalahan lainnya
    throw new Error('Invalid token');
  }
};

export const generateTokens = (userId?: string, email?: string): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken({ user_id: userId, email });
  const refreshToken = generateRefreshToken({ user_id: userId, email });
  return { accessToken, refreshToken };
};
