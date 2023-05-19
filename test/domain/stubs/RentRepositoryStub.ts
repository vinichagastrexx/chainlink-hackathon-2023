import { IRentRepository } from '../../../src/domain/repositories/RentRepository';
import { Rent } from '../../../src/domain/models/Rent';

export class RentRepositoryStub implements IRentRepository {
  finishRent(): Promise<boolean> {
    return new Promise(() => null);
  }

  getById(rentId: string): Promise<Rent> {
    return new Promise(() => null);
  }

  initRent(rent: Rent): Promise<boolean> {
    return new Promise(() => null);
  }
}
