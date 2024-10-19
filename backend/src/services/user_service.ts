import { omit } from 'lodash';
import { Model } from 'sequelize';

import { IUserDocument } from '../infra/interfaces/user_interface';
import { UserModel } from '../models/user_model';

export class UserService {
  public async createUser(data: IUserDocument): Promise<IUserDocument> {
    const result: Model = await UserModel.create(data);
    const user: IUserDocument = omit(result.dataValues, ['password']) as IUserDocument;
    return user;
  }

  public async getUserByEmail(email: string): Promise<IUserDocument | null> {
    const data = await UserModel.findOne({
      where: {
        email
      }
    });
    if (data) {
      const user = data.get({ plain: true }) as IUserDocument;
      return user;
    }

    return null;
  }

  public async checkPassword(password: string, compPassword: string): Promise<boolean> {
    return UserModel.method.checkPassword(password, compPassword);
  }
}
