import { IItemRepository } from '../repositories/ItemRepository';
import { IPoolRepository } from '../repositories/PoolRepository';
import { IMarketplaceContractService, IRentItemResponse } from '../services/MarketplaceContractService';
import { Item } from '../models/Item';
import { Pool } from '../models/Pool';
import { Rent } from '../models/Rent';
import { IRentRepository } from '../repositories/RentRepository';
import { randomUUID } from 'crypto';

interface IRequest {
  poolId: string;
  userWallet: string;
}

interface IResponse {
  item: Item | null;
  pool: Pool;
  rent: Rent;
}

export class RentItem {
  constructor(
    private itemRepository: IItemRepository,
    private poolRepository: IPoolRepository,
    private marketplaceContractService: IMarketplaceContractService,
    private rentRepository: IRentRepository,
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

    const response = await this.retry(pool);
    if (!response) {
      throw new Error('Unable to rent item after multiple attempts');
    }

    const { item = null, rent = null } = response;
    if (!item || !rent) {
      throw new Error('Rent response is missing required fields');
    }
    const updatedItem: Item = { ...item, rented: true, rentedBy: { walletAddress: userWallet } };
    await this.itemRepository.updateItem(updatedItem);

    const updatedPool: Pool = {
      ...pool,
      rentedItems: [...pool.rentedItems, updatedItem],
      availableItems: pool.availableItems.filter((i) => i.id !== item.id),
    };

    await this.poolRepository.updatePool(updatedPool);

    const rentDone: Rent = {
      id: randomUUID(),
      item: updatedItem,
      pool: updatedPool,
      rentee: { walletAddress: userWallet },
      rentalStartDate: new Date(),
      rentalEndDate: rent.rentalEndDate,
      rentPrice: rent.rentPrice,
    };

    await this.rentRepository.initRent(rentDone);

    return { item: updatedItem, rent: rentDone, pool: updatedPool };
  }
  private async retry(pool: Pool, maxRetries = 3): Promise<IRentItemResponse | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.marketplaceContractService.rentItem(pool);
      } catch (e) {
        if (attempt === maxRetries - 1) {
          console.error('An error occurred while trying to rent the item in the marketplace contract', e);
          return null;
        }
      }
    }
    return null;
  }
}
