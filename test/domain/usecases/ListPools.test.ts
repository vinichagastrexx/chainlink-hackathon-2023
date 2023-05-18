import { ListPools } from '../../../src/domain/usecases/ListPools';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { PoolMock } from '../mocks/PoolMock';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';

const poolsMock = [PoolMock];
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
    expect(response).toEqual([PoolMock]);
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
