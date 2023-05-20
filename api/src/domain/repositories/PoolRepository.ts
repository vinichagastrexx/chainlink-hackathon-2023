import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

export interface IPoolRepository {
  addItemToPool(itemId: string, poolId: string): Promise<Pool>;
  checkItemInPool(itemId: string, poolId: string): Promise<boolean>;
  addPool(pool: Pool): Promise<Pool>;
  removePool(poolId: string): Promise<boolean>;
  removeItemFromPool(item: Item, poolId: string): Promise<boolean>;
  updatePool(pool: Pool): Promise<boolean>;
  getById(poolId: string): Promise<Pool | null>;
  getAll(): Promise<Pool[]>;
}
