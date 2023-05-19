import { IRentRepository } from '../repositories/RentRepository';
import { IItemRepository } from '../repositories/ItemRepository';
import { IMarketplaceContractService } from '../services/MarketplaceContractService';
import { Item } from '../models/Item';
import { IPoolRepository } from '../repositories/PoolRepository';

interface IRequest {
  rentId: string;
  userWallet: string;
}

interface IResponse {
  item: Item;
}

export class ReturnItem {
  constructor(
    private rentRepository: IRentRepository,
    private itemRepository: IItemRepository,
    private poolRepository: IPoolRepository,
    private marketplaceContractService: IMarketplaceContractService,
  ) {}

  async execute({ rentId, userWallet }: IRequest): Promise<IResponse> {
    const rent = await this.rentRepository.getById(rentId);

    if (!rent) {
      throw new Error('Rent not Found');
    }

    if (rent.renter.walletAddress !== userWallet) {
      throw new Error('You are not the renter of this Item');
    }

    try {
      await this.marketplaceContractService.returnItem(rent.item, rent.pool);
    } catch (e) {
      throw new Error('An error occurred while trying to return the item in the marketplace contract');
    }

    //todo criar factories das entidades
    const item = this.itemRepository.findById(rent.item.id) as unknown as Item;
    item.isInPool = false;
    item.poolId = undefined;
    item.rented = false;
    item.rentedBy = undefined;

    try {
      await this.itemRepository.updateItem(item);
      await this.poolRepository.removeItemFromPool(rent.item, rent.pool.id);
    } catch (e) {
      throw new Error('An error occurred while updating the item');
    }

    return {
      item,
    };
  }
}
