import { AddUser } from '../../../domain/usecases/AddUser';
import { UserMongoRepository } from '../../../infra/db/mongodb/user-repository/user';

export const makeAddUserUseCase = (): AddUser => {
  const userMongoRepository = new UserMongoRepository();
  return new AddUser(userMongoRepository);
};
