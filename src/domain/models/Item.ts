import { User } from './User';

export interface Item {
  id: string;
  name: string;
  category: Category;
  nftId: string;
  owner: User;
  rented: boolean;
  rentedBy?: User;
  isInPool: boolean;
  poolId: string;
}

interface Category {
  id: string;
  name: string;
}
