import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';
import { Item } from '../../../src/domain/models/Item';
import { Pool } from '../../../src/domain/models/Pool';

export class MarketplaceContractServiceStub implements IMarketplaceContractService {
  async rentItem(pool: Pool): Promise<Item> {
    return new Promise(() => null);
  }

  addToPool(item: Item): Promise<boolean> {
    return new Promise(() => null);
  }

  removeFromPool(item: Item): Promise<boolean> {
    return new Promise(() => null);
  }
}
