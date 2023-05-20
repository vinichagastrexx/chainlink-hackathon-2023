import { Router } from 'express';
import { makeAddUserController } from '../factories/controllers/user/addUser';
import { adaptRoute } from '../adapters/expressRouteAdapter';

export default (router: Router): void => {
  router.post('/add-user', adaptRoute(makeAddUserController()));
};
