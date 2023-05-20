import { Item } from '../../../src/domain/models/Item';
import { UserMockRenter } from './UserMock';
import { ObjectId } from 'mongodb';

export const ItemMock: Item = {
  id: new ObjectId(),
  name: 'valid_name',
  category: {
    name: 'teste',
    id: new ObjectId(),
  },
  nftId: 'nftId',
  owner: UserMockRenter,
};
