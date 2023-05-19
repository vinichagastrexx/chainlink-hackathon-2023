import { Item } from '../../../src/domain/models/Item';
import { UserMockRenter } from './UserMock';

export const ItemMock: Item = {
  id: 'valid_id',
  name: 'valid_name',
  category: {
    name: 'teste',
    id: 'id',
  },
  nftId: 'nftId',
  owner: UserMockRenter,
  rented: false,
  isInPool: false,
};
