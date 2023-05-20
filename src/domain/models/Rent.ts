import { User } from './User';

export interface Rent {
  id: string;
  itemId: string;
  poolId: string;
  rentee: User;
  rentalStartDate: Date;
  rentalEndDate?: Date;
  rentPrice?: number;
  rentPaid?: boolean;
}
