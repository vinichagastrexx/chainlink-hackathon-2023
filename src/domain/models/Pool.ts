import { Item } from './Item';
import { ItemCategory } from './ItemCategory';

export interface Pool {
  id: string;
  availableItems: Item[];
  rentedItems: Item[];
  itemCategory: ItemCategory;
}
