import {
  IMarketplaceContractService,
  IRentItemResponse,
} from '../../../src/domain/services/MarketplaceContractService';
import { Item } from '../../../src/domain/models/Item';
import { Pool } from '../../../src/domain/models/Pool';

export class MarketplaceContractServiceStub implements IMarketplaceContractService {
  async addToPool(item: Item): Promise<boolean> {
    return new Promise(() => null);
  }

  async removeFromPool(item: Item): Promise<boolean> {
    return new Promise(() => null);
  }
  async returnItem(item: Item, pool: Pool): Promise<Item> {
    return new Promise(() => null);
  }

  rentItem(pool: Pool): Promise<IRentItemResponse> {
    return new Promise(() => null);
  }
}
