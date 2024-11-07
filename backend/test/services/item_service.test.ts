import { v4 as uuidv4 } from 'uuid';

import { ItemService } from '../../src/services/item_service'; // Sesuaikan dengan lokasi yang sesuai
import { ItemsModel } from '../../src/models/item_model';
import { IItemDocument } from '../../src/infra/interfaces/item_interface';

jest.mock('../../src/models/item_model', () => {
  return {
    ItemsModel: {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn()
    }
  };
});

describe('ItemService', () => {
  let itemService: ItemService;
  let itemData: IItemDocument;
  const mockUuidParent = uuidv4();
  const mockUuidChild = uuidv4();
  const mockUuidUser = uuidv4();

  beforeEach(() => {
    itemService = new ItemService();
    itemData = {
      name: 'item-name',
      user_id: mockUuidUser,
      type: 'file',
      size: 0,
      path: '/uploads/',
      parent_id: mockUuidParent,
      virtual_path: ' uploads '
    } as IItemDocument;
  });

  describe('createItem', () => {
    it('should create a new item and return the item', async () => {
      const mockCreate = ItemsModel.create as jest.Mock;
      mockCreate.mockResolvedValue({
        dataValues: { ...itemData, id: mockUuidChild }
      });
      const result = await itemService.createItem(itemData);

      expect(result).toEqual({
        dataValues: {
          name: 'item-name',
          user_id: mockUuidUser,
          type: 'file',
          size: 0,
          path: '/uploads/',
          parent_id: mockUuidParent,
          virtual_path: ' uploads ',
          id: mockUuidChild
        }
      });
      expect(mockCreate).toHaveBeenCalledWith(itemData);
    });
  });
});
