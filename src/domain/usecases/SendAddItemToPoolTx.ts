import { IItemRepository } from '../repositories/ItemRepository';
import { IPoolRepository } from '../repositories/PoolRepository';
import { Item } from '../models/Item';
import { IMarketplaceContractService } from '../services/MarketplaceContractService';
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

export class SendAddItemToPoolTx {
  constructor(
    private itemRepository: IItemRepository,
    private poolRepository: IPoolRepository,
    private marketplaceContractService: IMarketplaceContractService,
  ) {}

  async execute({ itemId, poolId }: IRequest): Promise<IResponse> {
    let item: Item | null;
    try {
      item = await this.itemRepository.findById(itemId);
    } catch (e) {
      throw new Error('An error occurred while trying to add item to pool');
    }
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

    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await this.marketplaceContractService.addToPool(item, pool);
        break;
      } catch (e) {
        if (attempt === MAX_RETRIES - 1) {
          throw new Error('An error occurred while trying to add item to the pool in the marketplace contract');
        }
      }
    }

    return {
      data: {
        item,
        pool,
      },
    };
  }
}
