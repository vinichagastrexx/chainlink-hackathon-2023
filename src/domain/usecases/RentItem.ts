import { IItemRepository } from '../repositories/ItemRepository';
import { IPoolRepository } from '../repositories/PoolRepository';
import { IMarketplaceContractService } from '../services/MarketplaceContractService';
import { Item } from '../models/Item';
import { Pool } from '../models/Pool';

interface IRequest {
  poolId: string;
  userWallet: string;
}

interface IResponse {
  item: Item | null;
  pool: Pool;
}

export class RentItem {
  constructor(
    private itemRepository: IItemRepository,
    private poolRepository: IPoolRepository,
    private marketplaceContractService: IMarketplaceContractService,
  ) {}

  async execute({ poolId, userWallet }: IRequest): Promise<IResponse> {
    const pool = await this.poolRepository.getById(poolId);

    if (!pool) {
      throw new Error('Pool not Found');
    }

    const items = pool.availableItems;

    if (items.length < 1) {
      throw new Error('No available items in the pool');
    }

    const MAX_RETRIES = 3;
    let rentedItem: Item | null = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        rentedItem = await this.marketplaceContractService.rentItem(pool);
        break;
      } catch (e) {
        if (attempt === MAX_RETRIES - 1) {
          throw new Error('An error occurred while trying to rent the item in the marketplace contract');
        }
      }
    }

    if (rentedItem) {
      rentedItem.rented = true;
      rentedItem.rentedBy = { walletAddress: userWallet };
      await this.itemRepository.updateItem(rentedItem);
      pool.rentedItems.push(rentedItem);
      pool.availableItems = pool.availableItems.filter((item) => item.id !== rentedItem?.id);

      await this.poolRepository.updatePool(pool);
    }
    return { item: rentedItem, pool };
  }
}
