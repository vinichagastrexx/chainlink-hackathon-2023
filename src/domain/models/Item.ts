import { User } from './User';
import { ItemCategory } from './ItemCategory';
import { ObjectId } from 'mongodb';

export interface Item {
  id: ObjectId;
  name: string;
  category: ItemCategory;
  nftId: string;
  owner: User;
  rentedBy?: User;
  poolId?: string;
}
