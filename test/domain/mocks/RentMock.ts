import { Rent } from '../../../src/domain/models/Rent';
import { ItemMock } from './ItemMock';
import { PoolWithItemsMock } from './PoolMock';
import { UserMockRentee } from './UserMock';

export const RentMock: Rent = {
  id: '',
  item: ItemMock,
  pool: PoolWithItemsMock,
  rentPaid: false,
  rentPrice: 0,
  rentalStartDate: new Date(),
  rentee: UserMockRentee,
};
