import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';
import { ItemRepositoryStub } from '../stubs/ItemRepositoryStub';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';
import { MarketplaceContractServiceStub } from '../stubs/MarketplaceContractServiceStub';
import { RemoveItemFromPool } from '../../../src/domain/usecases/RemoveItemFromPool';
import { PoolMock } from '../mocks/PoolMock';

let removeItemFromPool: RemoveItemFromPool;
let itemRepositoryStub: IItemRepository;
let poolRepositoryStub: IPoolRepository;
let marketplaceContractServiceStub: IMarketplaceContractService;

describe('Remove Item from Pool UseCase', () => {
  beforeEach(() => {
    itemRepositoryStub = new ItemRepositoryStub();
    poolRepositoryStub = new PoolRepositoryStub();
    marketplaceContractServiceStub = new MarketplaceContractServiceStub();
    removeItemFromPool = new RemoveItemFromPool(itemRepositoryStub, poolRepositoryStub, marketplaceContractServiceStub);
  });

  it('should throw if the pool does not exist', async () => {
    const requestMock = { poolId: 'invalid_id', userWallet: 'valid_id', itemId: 'item-id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(null);

    await expect(removeItemFromPool.execute(requestMock)).rejects.toThrow('Pool not Found');
  });

  it('should throw if the item is not in the available items list', async () => {
    const requestMock = { poolId: 'invalid_id', userWallet: 'valid_id', itemId: 'item-id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolMock);
    const response = removeItemFromPool.execute(requestMock);
    await expect(response).rejects.toThrow('Item not found in the list of available itens');
  });

  // it('should throw if ItemRepository throws', async () => {
  //   jest.spyOn(itemRepositoryStub, 'findById').mockImplementationOnce(() => {
  //     throw new Error();
  //   });
  //
  //   const itemMock = { itemId: 'valid_id' };
  //   const promise = removeItemFromPool.execute(itemMock);
  //
  //   await expect(promise).rejects.toThrow('An error occurred while trying to add item to pool');
  // });
  //
  // it('should retry 3 times if marketplace contract service throws', async () => {
  //   const itemMock = { itemId: 'valid_id' };
  //   jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: false });
  //   jest.spyOn(marketplaceContractServiceStub, 'addToPool').mockImplementation(() => {
  //     throw new Error('Error in contract service');
  //   });
  //   const promise = removeItemFromPool.execute(itemMock);
  //   await expect(promise).rejects.toThrow(
  //     'An error occurred while trying to add item to the pool in the marketplace contract',
  //   );
  //   expect(marketplaceContractServiceStub.addToPool).toBeCalledTimes(3);
  // });
  //
  // it('should throw if PoolRepository throws', async () => {
  //   jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: false });
  //   jest.spyOn(marketplaceContractServiceStub, 'addToPool').mockResolvedValueOnce(true);
  //   jest.spyOn(poolRepositoryStub, 'removeItemFromPool').mockImplementationOnce(() => {
  //     throw new Error();
  //   });
  //
  //   const itemMock = { itemId: 'valid_id' };
  //   const promise = removeItemFromPool.execute(itemMock);
  //
  //   await expect(promise).rejects.toThrow('An error occurred while trying to add item to pool');
  // });
  //
  // it('should add the item to the pool if it exists and it is not in the pool', async () => {
  //   jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: false });
  //   jest.spyOn(marketplaceContractServiceStub, 'addToPool').mockResolvedValueOnce(true);
  //   jest.spyOn(poolRepositoryStub, 'updatePool').mockResolvedValueOnce({ ...item, isInPool: false });
  //   const itemMock = { itemId: 'itemId' };
  //   const response = removeItemFromPool.execute(itemMock);
  //   await expect(response).resolves.toEqual({ ...item, isInPool: true });
  // });
});
