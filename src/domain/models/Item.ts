import { User } from './User';
import { ItemCategory } from './ItemCategory';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  nftId: string;
  owner: User;
  rented: boolean;
  rentedBy?: User;
  isInPool: boolean;
  poolId?: string;
}
