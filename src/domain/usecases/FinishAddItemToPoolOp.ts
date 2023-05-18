import { IItemRepository } from '../repositories/ItemRepository';
import { IPoolRepository } from '../repositories/PoolRepository';
import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

interface IRequest {
  itemId: string;
  poolId: string;
}

interface IResponse {
  item: Item;
  pool: Pool;
}

export class FinishAddItemToPoolOp {
  constructor(private itemRepository: IItemRepository, private poolRepository: IPoolRepository) {}

  async execute({ itemId, poolId }: IRequest): Promise<IResponse> {
    let item: Item | null;
    try {
      item = await this.itemRepository.findById(itemId);
    } catch (e) {
      throw new Error('An error occurred while trying to get item');
    }

    if (!item) {
      throw new Error('Item not Found');
    }

    if (item.isInPool) {
      throw new Error('Item is already in the pool');
    }

    let pool: Pool | null;
    try {
      pool = await this.poolRepository.getById(poolId);
    } catch (e) {
      throw new Error('An error occurred while trying to get pool');
    }

    if (!pool) {
      throw new Error('Pool not Found');
    }

    const updatedItem: Item = {
      ...item,
      isInPool: true,
      poolId: pool.id,
    };

    pool.availableItems.push(item);

    try {
      await this.itemRepository.updateItem(updatedItem);
      pool = await this.poolRepository.addItemToPool(item, poolId);
    } catch (e) {
      throw new Error('An error occurred while adding item to pool');
    }

    return {
      item: updatedItem,
      pool,
    };
  }
}
