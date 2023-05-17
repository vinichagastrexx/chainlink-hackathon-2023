import { Item } from '../models/Item';

export interface IMarketplaceContractService {
  addToPool(item: Item): Promise<void>;
}
