import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

export interface IPoolRepository {
  addItemToPool(item: Item): Promise<Item>;
  getAll(): Promise<Pool[]>;
}
