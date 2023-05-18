import { IPoolRepository } from '../repositories/PoolRepository';
import { IMarketplaceContractService } from '../services/MarketplaceContractService';
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

export class SendRemoveItemFromPoolTx {
  constructor(
    private poolRepository: IPoolRepository,
    private marketplaceContractService: IMarketplaceContractService,
  ) {}

  async execute({ poolId, itemId, userWallet }: IRequest): Promise<IResponse> {
    const pool = await this.poolRepository.getById(poolId);

    if (!pool) {
      throw new Error('Pool not Found');
    }

    const itemIndex = pool.availableItems.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found in the list of available itens');
    }
    const item = pool.availableItems[itemIndex];
    if (item.owner.walletAddress !== userWallet) {
      throw new Error('You are not the owner of this Item');
    }

    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await this.marketplaceContractService.removeFromPool(item, pool);
        break;
      } catch (e) {
        if (attempt === MAX_RETRIES - 1) {
          throw new Error('An error occurred while trying to remove the item from the marketplace contract');
        }
      }
    }

    return {
      item,
      pool,
    };
  }
}
