import { DataTypes, ModelDefined, Optional } from 'sequelize';

import { ITokenDocument } from '../infra/interfaces/token_interface';
import { sqlz } from '../db';

type TokenCreationAttributes = Optional<ITokenDocument, 'createdAt' | 'updatedAt' | 'deletedAt'>;

const TokenModel: ModelDefined<ITokenDocument, TokenCreationAttributes> = sqlz.define(
  'tokens',
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    acc_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ref_token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['acc_token']
      }
    ]
  }
) as ModelDefined<ITokenDocument, TokenCreationAttributes>;

export { TokenModel };
