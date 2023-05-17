import { Item } from '../models/Item';

export interface IItemRepository {
  findById(itemId: string): Promise<Item | null>;
}
