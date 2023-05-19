import { makeAddUserUseCase } from '../../usecases/addUser';
import { Controller } from '../../../../presentation/protocols';
import { makeAddUserValidation } from './addUserValidation';
import { AddUserController } from '../../../../presentation/controllers/user/addUserController';

export const makeAddUserController = (): Controller => {
  return new AddUserController(makeAddUserUseCase(), makeAddUserValidation());
};
