import { ITokenDocument } from '../infra/interfaces/token_interface';
import { TokenModel } from '../models/token_model';

export class TokenService {
  public async createToken(data: ITokenDocument): Promise<ITokenDocument> {
    const result = await TokenModel.create(data);
    return result as ITokenDocument;
  }

  public async updateTokenByUserId(data: ITokenDocument): Promise<void> {
    await TokenModel.update(
      {
        acc_token: data.acc_token,
        ref_token: data.ref_token
      },
      {
        where: {
          user_id: data.user_id
        }
      }
    );
  }
}
