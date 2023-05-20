import { Item } from '../models/Item';
import { Pool } from '../models/Pool';
import { Rent } from '../models/Rent';

export interface IMarketplaceContractService {
  addToPool(item: Item, pool: Pool): Promise<boolean>;
  rentItem(pool: Pool): Promise<IRentItemResponse>;
  returnItem(item: Item, pool: Pool): Promise<Item>;
  removeFromPool(item: Item, pool: Pool): Promise<boolean>;
}

export interface IRentItemResponse {
  item: Item;
  rent: Rent;
}
