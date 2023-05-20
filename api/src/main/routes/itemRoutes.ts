import { Router } from 'express';
import { adaptRoute } from '../adapters/expressRouteAdapter';
import { makeSendAddItemToPoolTxController } from '../factories/controllers/item/sendAddItemToPool';
import { makeFinishAddItemToPoolOpController } from '../factories/controllers/item/finishAddItemToPoolOp';

export default (router: Router): void => {
  router.post('/send-add-item-to-pool', adaptRoute(makeSendAddItemToPoolTxController()));
  router.post('/finish-add-item-to-pool-op', adaptRoute(makeFinishAddItemToPoolOpController()));
};
