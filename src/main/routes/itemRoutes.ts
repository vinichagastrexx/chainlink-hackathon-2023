import { Router } from 'express';
import { adaptRoute } from '../adapters/expressRouteAdapter';
import { makeSendAddItemToPoolTxController } from '../factories/controllers/item/sendAddItemToPool';

export default (router: Router): void => {
  router.post('/send-add-item-to-pool', adaptRoute(makeSendAddItemToPoolTxController()));
};
