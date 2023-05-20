import { Controller } from '../../../../presentation/protocols';
import { makeFinishAddItemToPoolOpValidation } from './finishAddItemToPoolValidation';
import { FinishAddItemToPoolOpController } from '../../../../presentation/controllers/item/finishAddItemToPoolOpController';
import { makeFinishAddItemToPoolOp } from '../../usecases/finishAddItemToPoolOp';

export const makeFinishAddItemToPoolOpController = (): Controller => {
  return new FinishAddItemToPoolOpController(makeFinishAddItemToPoolOp(), makeFinishAddItemToPoolOpValidation());
};
