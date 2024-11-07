import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../../src/services/user_service'; // Sesuaikan dengan lokasi yang sesuai
import { UserModel } from '../../src/models/user_model';
import { IUserDocument } from '../../src/infra/interfaces/user_interface';

jest.mock('../../src/models/user_model', () => {
  return {
    UserModel: {
      create: jest.fn(),
      findOne: jest.fn(),
      method: {
        checkPassword: jest.fn()
      }
    }
  };
});

describe('UserService', () => {
  let userService: UserService;
  let userData: IUserDocument;
  const mockUuid = uuidv4();

  beforeEach(() => {
    userService = new UserService();
    userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      username: 'john_doe'
    } as IUserDocument;
  });

  describe('createUser', () => {
    it('should create a new user and return the user without password', async () => {
      const mockCreate = UserModel.create as jest.Mock;
      mockCreate.mockResolvedValue({
        dataValues: { ...userData, id: mockUuid }
      });

      const result = await userService.createUser(userData);
      expect(result).toEqual({
        email: 'test@example.com',
        password: undefined, // Password should be omitted
        name: 'John Doe',
        username: 'john_doe',
        id: mockUuid // ID is now UUID
      });
      expect(mockCreate).toHaveBeenCalledWith(userData);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if the email exists with UUID', async () => {
      const mockFindOne = UserModel.findOne as jest.Mock;
      mockFindOne.mockResolvedValue({
        get: jest.fn().mockReturnValue({ ...userData, id: mockUuid })
      });

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).toEqual({ ...userData, id: mockUuid });
      expect(mockFindOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null if the email does not exist', async () => {
      // Mock findOne method
      const mockFindOne = UserModel.findOne as jest.Mock;
      mockFindOne.mockResolvedValue(null);

      const result = await userService.getUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
    });
  });

  describe('checkPassword', () => {
    it('should return true if passwords match', async () => {
      // Mock checkPassword method
      const mockCheckPassword = UserModel.method.checkPassword as jest.Mock;
      mockCheckPassword.mockResolvedValue(true);

      const result = await userService.checkPassword('password123', 'password123');

      expect(result).toBe(true);
      expect(mockCheckPassword).toHaveBeenCalledWith('password123', 'password123');
    });

    it('should return false if passwords do not match', async () => {
      // Mock checkPassword method
      const mockCheckPassword = UserModel.method.checkPassword as jest.Mock;
      mockCheckPassword.mockResolvedValue(false);

      const result = await userService.checkPassword('password123', 'wrongpassword');

      expect(result).toBe(false);
      expect(mockCheckPassword).toHaveBeenCalledWith('password123', 'wrongpassword');
    });
  });
});
