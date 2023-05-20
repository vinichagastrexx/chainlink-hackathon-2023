import { Controller } from '../../../../presentation/protocols';
import { makeSendAddItemToPoolTx } from '../../usecases/sendAddItemToPoolTx';
import { makeSendAddItemToPoolValidation } from './sendAddItemToPoolValidation';
import { SendAddItemToPoolTxController } from '../../../../presentation/controllers/item/sendAddItemToPoolTxController';

export const makeSendAddItemToPoolTxController = (): Controller => {
  return new SendAddItemToPoolTxController(makeSendAddItemToPoolTx(), makeSendAddItemToPoolValidation());
};
