import { Pool } from '../../../src/domain/models/Pool';
import { ItemMock } from './ItemMock';

export const PoolWithoutItemsMock: Pool = {
  id: 'valid_id',
  availableItems: [],
  rentedItems: [],
  itemCategory: {
    id: 'categoryId',
    name: 'categoryName',
  },
};

export const PoolWithItemsMock: Pool = {
  id: 'valid_id',
  availableItems: [ItemMock],
  rentedItems: [],
  itemCategory: {
    id: 'categoryId',
    name: 'categoryName',
  },
};
