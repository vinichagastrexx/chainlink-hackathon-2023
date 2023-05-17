import { Item } from '../../../src/domain/models/Item';
import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { AddItemToPool } from '../../../src/domain/usecases/AddItemToPool';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';

const item: Item = {
  id: 'valid_id',
  name: 'valid_name',
  category: {
    name: 'teste',
    id: 'id',
  },
  nftId: 'nftId',
  owner: {
    id: 'userId',
    username: 'username',
    walletAddress: 'walletAdress',
  },
  rented: false,
  isInPool: false,
  poolId: 'poolId',
};

class ItemRepositoryStub implements IItemRepository {
  async findById(id: string): Promise<Item | null> {
    return new Promise(() => null);
  }
}

class PoolRepositoryStub implements IPoolRepository {
  async addItemToPool(item: Item): Promise<Item> {
    return new Promise(() => null);
  }
}

class MarketplaceContractServiceStub implements IMarketplaceContractService {
  async addToPool(item: Item): Promise<void> {
    return;
  }
}

let addItemToPool: AddItemToPool;
let itemRepositoryStub: ItemRepositoryStub;
let poolRepositoryStub: PoolRepositoryStub;
let marketplaceContractServiceStub: MarketplaceContractServiceStub;

describe('Add Item To Pool UseCase', () => {
  beforeEach(() => {
    itemRepositoryStub = new ItemRepositoryStub();
    poolRepositoryStub = new PoolRepositoryStub();
    marketplaceContractServiceStub = new MarketplaceContractServiceStub();
    addItemToPool = new AddItemToPool(itemRepositoryStub, poolRepositoryStub, marketplaceContractServiceStub);
  });

  it('should throw if the item does not exist', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(null);
    const itemMock = { itemId: 'invalid_id', poolId: false };
    const response = addItemToPool.execute(itemMock);
    await expect(response).rejects.toThrow('Item not Found');
  });

  it('should throw if the item is already in the pool', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: true });
    const itemMock = { itemId: 'already_in_pool_id', poolId: true };
    const response = addItemToPool.execute(itemMock);
    await expect(response).rejects.toThrow('Item is already in the pool');
  });

  it('should throw if ItemRepository throws', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockImplementationOnce(() => {
      throw new Error();
    });

    const itemMock = { itemId: 'valid_id' };
    const promise = addItemToPool.execute(itemMock);

    await expect(promise).rejects.toThrow('An error occurred while trying to add item to pool');
  });

  it('should retry 3 times if marketplace contract service throws', async () => {
    const itemMock = { itemId: 'valid_id' };
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: false });
    jest.spyOn(marketplaceContractServiceStub, 'addToPool').mockImplementation(() => {
      throw new Error('Error in contract service');
    });
    const promise = addItemToPool.execute(itemMock);
    await expect(promise).rejects.toThrow(
      'An error occurred while trying to add item to the pool in the marketplace contract',
    );
    expect(marketplaceContractServiceStub.addToPool).toBeCalledTimes(3);
  });

  it('should throw if PoolRepository throws', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: false });
    jest.spyOn(poolRepositoryStub, 'addItemToPool').mockImplementationOnce(() => {
      throw new Error();
    });

    const itemMock = { itemId: 'valid_id' };
    const promise = addItemToPool.execute(itemMock);

    await expect(promise).rejects.toThrow('An error occurred while trying to add item to pool');
  });

  it('should add the item to the pool if it exists and it is not in the pool', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: false });
    jest.spyOn(poolRepositoryStub, 'addItemToPool').mockResolvedValueOnce({ ...item, isInPool: true });
    const itemMock = { itemId: 'itemId' };
    const response = addItemToPool.execute(itemMock);
    await expect(response).resolves.toEqual({ ...item, isInPool: true });
  });
});
