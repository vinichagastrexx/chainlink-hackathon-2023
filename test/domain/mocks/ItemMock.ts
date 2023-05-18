import { Item } from '../../../src/domain/models/Item';

export const ItemMock: Item = {
  id: 'valid_id',
  name: 'valid_name',
  category: {
    name: 'teste',
    id: 'id',
  },
  nftId: 'nftId',
  owner: {
    id: 'userId',
    username: 'username',
    walletAddress: 'walletAdress',
  },
  rented: false,
  isInPool: true,
  poolId: 'poolId',
};
