import { ItemMongoRepository } from '../../../infra/db/mongodb/item-repository/item';
import { PoolMongoRepository } from '../../../infra/db/mongodb/pool-repository/pool';
import { FinishAddItemToPoolOp } from '../../../domain/usecases/FinishAddItemToPoolOp';

export const makeFinishAddItemToPoolOp = (): FinishAddItemToPoolOp => {
  const itemRepository = new ItemMongoRepository();
  const poolRepository = new PoolMongoRepository();

  return new FinishAddItemToPoolOp(itemRepository, poolRepository);
};
