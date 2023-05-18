import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

export interface IMarketplaceContractService {
  addToPool(item: Item, pool: Pool): Promise<boolean>;
  rentItem(pool: Pool): Promise<Item>;
  removeFromPool(item: Item): Promise<boolean>;
}
