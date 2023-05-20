import { IPoolRepository } from '../repositories/PoolRepository';
import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

interface IRequest {
  poolId: string;
  itemId: string;
  userWallet: string;
}

interface IResponse {
  item: Item;
  pool: Pool;
}

export class FinishRemoveItemFromPoolOp {
  constructor(private poolRepository: IPoolRepository) {}

  async execute({ poolId, itemId }: IRequest): Promise<IResponse> {
    const pool = await this.poolRepository.getById(poolId);

    if (!pool) {
      throw new Error('Pool not Found');
    }

    const itemIndex = pool.availableItems.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found in the list of available itens');
    }
    const item = pool.availableItems[itemIndex];

    pool.availableItems.splice(itemIndex, 1);

    await this.poolRepository.updatePool(pool);

    return { item, pool };
  }
}
