import { Item } from '../models/Item';

export interface IPoolRepository {
  addItemToPool(item: Item): Promise<Item>;
}
