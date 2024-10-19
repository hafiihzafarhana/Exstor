import { DataTypes, ModelDefined, Optional } from 'sequelize';

import { sqlz } from '../db';
import { IItemDocument } from '../infra/interfaces/item_interface';

type ItemCreationAttributes = Optional<IItemDocument, 'createdAt' | 'updatedAt' | 'deletedAt'>;

const ItemsModel: ModelDefined<IItemDocument, ItemCreationAttributes> = sqlz.define(
  'items',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    parent_id: {
      type: DataTypes.UUID,
      allowNull: true, // Bisa null jika item adalah root
      references: {
        model: 'items', // Self-referencing jika item adalah child dari item lain
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('file', 'folder'),
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true // Boleh null untuk folder
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        fields: ['user_id'] // Index untuk mempercepat query berdasarkan `user_id`
      }
    ]
  }
) as ModelDefined<IItemDocument, ItemCreationAttributes>;

export { ItemsModel };
