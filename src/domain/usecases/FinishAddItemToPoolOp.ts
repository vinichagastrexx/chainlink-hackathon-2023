import { IItemRepository } from '../repositories/ItemRepository';
import { IPoolRepository } from '../repositories/PoolRepository';
import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

interface IRequest {
  itemId: string;
  poolId: string;
}

interface IResponse {
  data: {
    item: Item;
    pool: Pool;
  } | null;
  error?: Error;
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

    console.log(item);

    if (!item) {
      return {
        data: null,
        error: new Error('Item not Found'),
      };
    }

    let pool: Pool | null;
    try {
      pool = await this.poolRepository.getById(poolId);
    } catch (e) {
      throw new Error('An error occurred while trying to get pool');
    }

    if (!pool) {
      return {
        data: null,
        error: new Error('Pool not Found'),
      };
    }

    const itemAlreadyInPool = await this.poolRepository.checkItemInPool(itemId, poolId);

    if (itemAlreadyInPool) {
      return {
        data: null,
        error: new Error('Item is already in the pool'),
      };
    }

    const updatedItem: Item = {
      ...item,
      poolId: pool.id,
    };

    try {
      await this.itemRepository.updateItem(updatedItem);
      pool = await this.poolRepository.addItemToPool(item.id, poolId);
    } catch (e) {
      throw new Error('An error occurred while adding item to pool');
    }

    return {
      data: {
        item: updatedItem,
        pool,
      },
    };
  }
}
