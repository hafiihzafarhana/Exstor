import { v4 as uuidv4 } from 'uuid';

import { TokenService } from '../../src/services/token_service'; // Sesuaikan dengan lokasi yang sesuai
import { TokenModel } from '../../src/models/token_model';
import { ITokenDocument } from '../../src/infra/interfaces/token_interface';

jest.mock('../../src/models/token_model', () => {
  return {
    TokenModel: {
      create: jest.fn(),
      update: jest.fn()
    }
  };
});

describe('TokenService', () => {
  let tokenService: TokenService;
  let tokenData: ITokenDocument;
  const mockUuid = uuidv4();

  beforeEach(() => {
    tokenService = new TokenService();
    tokenData = {
      acc_token: 'access_token',
      ref_token: 'refresh_token',
      user_id: mockUuid
    } as ITokenDocument;
  });

  describe('createToken', () => {
    it('should create a new token and return the token', async () => {
      // Mocking implementasi create untuk TokenModel
      const mockCreate = TokenModel.create as jest.Mock;

      // Menyimulasikan bahwa create berhasil dan mengembalikan tokenData
      mockCreate.mockResolvedValue(tokenData);

      // Memanggil method createToken() dari service
      const result = await tokenService.createToken(tokenData);

      // Memastikan hasil sesuai dengan ekspektasi
      expect(result).toEqual(tokenData); // Memastikan hasilnya sesuai dengan data yang diberikan
      expect(mockCreate).toHaveBeenCalledWith(tokenData);
    });
  });

  describe('updateToken', () => {
    it('should update the token by user id', async () => {
      const mockUpdate = TokenModel.update as jest.Mock;

      // Simulasi update berhasil
      mockUpdate.mockResolvedValue([1]); // Sequelize update biasanya mengembalikan [affectedRows, [updatedRows]]

      // Panggil method updateTokenByUserId
      await tokenService.updateTokenByUserId(tokenData);

      // Verifikasi bahwa update dipanggil dengan data yang benar
      expect(mockUpdate).toHaveBeenCalledWith(
        {
          acc_token: 'access_token',
          ref_token: 'refresh_token'
        },
        {
          where: {
            user_id: mockUuid
          }
        }
      );

      // Memastikan update dipanggil sekali
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
