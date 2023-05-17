import { IItemRepository } from '../repositories/ItemRepository';
import { IPoolRepository } from '../repositories/PoolRepository';
import { Item } from '../models/Item';
import { IMarketplaceContractService } from '../services/MarketplaceContractService';

interface IRequest {
  itemId: string;
}

export class AddItemToPool {
  constructor(
    private itemRepository: IItemRepository,
    private poolRepository: IPoolRepository,
    private marketplaceContractService: IMarketplaceContractService,
  ) {}

  async execute({ itemId }: IRequest): Promise<Item> {
    let item: Item | null;
    try {
      item = await this.itemRepository.findById(itemId);
    } catch (e) {
      throw new Error('An error occurred while trying to add item to pool');
    }

    if (!item) {
      throw new Error('Item not Found');
    }

    if (item.isInPool) {
      throw new Error('Item is already in the pool');
    }

    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await this.marketplaceContractService.addToPool(item);
        break;
      } catch (e) {
        if (attempt === MAX_RETRIES - 1) {
          throw new Error('An error occurred while trying to add item to the pool in the marketplace contract');
        }
      }
    }

    try {
      item = await this.poolRepository.addItemToPool(item);
    } catch (e) {
      throw new Error('An error occurred while trying to add item to poolRepository');
    }

    return item;
  }
}
