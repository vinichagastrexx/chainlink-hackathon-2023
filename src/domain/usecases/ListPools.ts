import { IPoolRepository } from '../repositories/PoolRepository';
import { Pool } from '../models/Pool';

export class ListPools {
  constructor(private poolRepository: IPoolRepository) {}

  async execute(): Promise<Pool[]> {
    try {
      return this.poolRepository.getAll();
    } catch (e) {
      throw new Error('An error occurred while trying get all Pools from poolRepository');
    }
  }
}
