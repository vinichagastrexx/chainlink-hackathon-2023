import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { Pool } from '../../../src/domain/models/Pool';
import { Item } from '../../../src/domain/models/Item';

export class PoolRepositoryStub implements IPoolRepository {
  async getById(poolId: string): Promise<Pool | null> {
    return new Promise(() => null);
  }

  addItemToPool(item: Item, poolId: string): Promise<Pool> {
    return new Promise(() => null);
  }

  getAll(): Promise<Pool[]> {
    return new Promise(() => null);
  }

  updatePool(pool: Pool): Promise<boolean> {
    return new Promise(() => null);
  }

  removeItemFromPool(item: Item, poolId: string): Promise<boolean> {
    return new Promise(() => null);
  }
}
