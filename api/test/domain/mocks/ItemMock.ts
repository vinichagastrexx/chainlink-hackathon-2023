import { Item } from '../../../src/domain/models/Item';
import { UserMockRenter } from './UserMock';

export const ItemMock: Item = {
  id: 'valid-id',
  name: 'valid_name',
  category: {
    name: 'teste',
    id: 'valid-id',
  },
  nftId: 'nftId',
  owner: UserMockRenter,
};
