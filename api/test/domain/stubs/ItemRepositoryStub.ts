import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { Item } from '../../../src/domain/models/Item';

export class ItemRepositoryStub implements IItemRepository {
  async updateItem(item: Item): Promise<boolean> {
    return new Promise(() => null);
  }

  async findById(id: string): Promise<Item | null> {
    return new Promise(() => null);
  }
}
