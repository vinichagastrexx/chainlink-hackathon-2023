import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

export interface IPoolRepository {
  addItemToPool(item: Item, poolId: string): Promise<Pool>;
  updatePool(pool: Pool): Promise<boolean>;
  getById(poolId: string): Promise<Pool | null>;
  getAll(): Promise<Pool[]>;
}
