import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

export interface IMarketplaceContractService {
  addToPool(item: Item): Promise<boolean>;
  rentItem(pool: Pool): Promise<Item>;
}
