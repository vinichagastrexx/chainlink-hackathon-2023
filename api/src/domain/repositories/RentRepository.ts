import { Rent } from '../models/Rent';

export interface IRentRepository {
  initRent(rent: Rent): Promise<boolean>;
  getById(rentId: string): Promise<Rent>;
  finishRent(rentId: string): Promise<boolean>;
}
