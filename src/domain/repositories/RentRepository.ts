import { Rent } from '../models/Rent';

export interface IRentRepository {
  initRent(): Promise<boolean>;
  getById(rentId: string): Promise<Rent>;
  finishRent(): Promise<boolean>;
}
