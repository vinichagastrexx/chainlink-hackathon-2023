import { Item } from '../models/Item';

export interface IItemRepository {
  findById(itemId: string): Promise<Item | null>;
  updateItem(item: Item): Promise<boolean>;
}
