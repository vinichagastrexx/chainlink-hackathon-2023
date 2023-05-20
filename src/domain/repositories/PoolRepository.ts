import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

export interface IPoolRepository {
  addItemToPool(item: Item, poolId: string): Promise<Pool>;
  addPool(pool: Pool): Promise<Pool>;
  removePool(poolId: string): Promise<boolean>;
  removeItemFromPool(item: Item, poolId: string): Promise<boolean>;
  updatePool(pool: Pool): Promise<boolean>;
  getById(poolId: string): Promise<Pool | null>;
  getAll(): Promise<Pool[]>;
}
