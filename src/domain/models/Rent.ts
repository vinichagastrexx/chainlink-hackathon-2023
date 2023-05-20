import { User } from './User';
import { ObjectId } from 'mongodb';

export interface Rent {
  id: ObjectId;
  itemId: ObjectId;
  poolId: ObjectId;
  rentee: User;
  rentalStartDate: Date;
  rentalEndDate?: Date;
  rentPrice?: number;
  rentPaid?: boolean;
}
