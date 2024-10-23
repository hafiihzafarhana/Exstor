import { Model, Op, QueryTypes } from 'sequelize';

import { IItemDocument } from '../infra/interfaces/item_interface';
import { ItemsModel } from '../models/item_model';
import { sqlz } from '../db';

export class ItemService {
  public async createItem(data: IItemDocument): Promise<IItemDocument> {
    const item: Model = await ItemsModel.create(data);
    return item as IItemDocument;
  }

  public async getById(id: string): Promise<IItemDocument> {
    const item = await ItemsModel.findByPk(id);
    return item as IItemDocument;
  }

  public async getByIdAndUserId(id: string, user_id: string): Promise<IItemDocument> {
    const item = await ItemsModel.findOne({
      where: {
        id,
        user_id
      }
    });
    return item as IItemDocument;
  }

  public async deleteById(id: string, user_id: string): Promise<void> {
    await ItemsModel.destroy({
      where: { id, user_id }
    });
  }

  public async getAllByParent(
    id: string,
    user_id: string,
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<IItemDocument[]> {
    const validSortFields = ['createdAt', 'name', 'type'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'; // Default sort by createdAt if invalid sortBy field

    const items = await ItemsModel.findAll({
      where: {
        parent_id: id,
        user_id
      },
      order: [[sortField, sortDirection]] // Sort by selected field and direction (ASC or DESC)
    });

    return items as IItemDocument[];
  }

  public async updateItem(id: string, name: string, path: string, formattedPath: string): Promise<void> {
    await ItemsModel.update({ name, path, virtual_path: formattedPath }, { where: { id } });
  }

  public async updateItemGrandChild(id: string, path: string, formattedPath: string): Promise<void> {
    await ItemsModel.update({ path, virtual_path: formattedPath }, { where: { id } });
  }

  public async deleteItemRecursively(id: string): Promise<void> {
    const query = `
        WITH RECURSIVE item_tree AS (
            SELECT id FROM items WHERE id = :itemId
            UNION ALL
            SELECT i.id
            FROM items i
            INNER JOIN item_tree it ON i.parent_id = it.id
        )
        DELETE FROM items
        WHERE id IN (SELECT id FROM item_tree);
    `;

    await sqlz.query(query, {
      replacements: { itemId: id }, // Mengganti :itemId dengan itemId yang sesuai
      type: QueryTypes.DELETE // Tipe query untuk DELETE
    });
  }

  public async getTheRoot(user_id: string): Promise<IItemDocument> {
    const items = await ItemsModel.findOne({
      where: {
        user_id,
        parent_id: null
      }
    });

    return items as IItemDocument;
  }

  public async getItemBySearchVirtualPath(basePath: string): Promise<IItemDocument[]> {
    const results = await ItemsModel.findAll({
      where: {
        virtual_path: {
          [Op.like]: `${basePath}%` // Menggunakan operator LIKE
        }
      }
    });

    return results as IItemDocument[];
  }
}
