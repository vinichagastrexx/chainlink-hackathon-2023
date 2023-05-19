import { Item } from './Item';
import { Pool } from './Pool';
import { User } from './User';

export interface Rent {
  id: string;
  item: Item;
  pool: Pool;
  renter: User;
  rentalStartDate: Date;
  rentalEndDate: Date;
  rentPaid: number;
}
