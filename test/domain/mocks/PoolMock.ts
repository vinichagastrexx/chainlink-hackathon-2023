import { Pool } from '../../../src/domain/models/Pool';

export const PoolMock: Pool = {
  id: 'valid_id',
  availableItems: [],
  rentedItems: [],
  itemCategory: {
    id: 'categoryId',
    name: 'categoryName',
  },
  currentPrice: 1,
};
