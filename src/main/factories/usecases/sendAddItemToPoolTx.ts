import { ItemMongoRepository } from '../../../infra/db/mongodb/item-repository/item';
import { PoolMongoRepository } from '../../../infra/db/mongodb/pool-repository/pool';
import { MarketplaceContractService } from '../../../infra/services/blockchain/marketplaceContractService';
import { SendAddItemToPoolTx } from '../../../domain/usecases/SendAddItemToPoolTx';

export const makeSendAddItemToPoolTx = (): SendAddItemToPoolTx => {
  const itemRepository = new ItemMongoRepository();
  const poolRepository = new PoolMongoRepository();
  const marketplaceContractService = new MarketplaceContractService();
  return new SendAddItemToPoolTx(itemRepository, poolRepository, marketplaceContractService);
};
