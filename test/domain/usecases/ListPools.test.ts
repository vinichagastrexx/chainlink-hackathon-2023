import { ListPools } from '../../../src/domain/usecases/ListPools';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { Pool } from '../../../src/domain/models/Pool';
import { Item } from '../../../src/domain/models/Item';

const poolsMock = [
  {
    id: 'valid_id',
    availableItems: [],
    rentedItems: [],
    itemCategory: {
      id: 'categoryId',
      name: 'categoryName',
    },
    currentPrice: 1,
  },
];
class PoolRepositoryStub implements IPoolRepository {
  async getAll(): Promise<Pool[]> {
    return new Promise(() => null);
  }

  async addItemToPool(item: Item): Promise<Item> {
    return new Promise(() => null);
  }
}

let listPools: ListPools;
let poolRepositoryStub: IPoolRepository;

describe('List Pools UseCase', () => {
  beforeEach(() => {
    poolRepositoryStub = new PoolRepositoryStub();
    listPools = new ListPools(poolRepositoryStub);
  });

  it('should return all pools', async () => {
    jest.spyOn(poolRepositoryStub, 'getAll').mockResolvedValueOnce(poolsMock);
    const response = await listPools.execute();
    expect(response).toEqual([
      {
        id: 'valid_id',
        availableItems: [],
        rentedItems: [],
        itemCategory: {
          id: 'categoryId',
          name: 'categoryName',
        },
        currentPrice: 1,
      },
    ]);
  });
  it('should throw if PoolRepository throws', async () => {
    jest.spyOn(poolRepositoryStub, 'getAll').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(listPools.execute()).rejects.toThrow(
      'An error occurred while trying get all Pools from poolRepository',
    );
  });
});
