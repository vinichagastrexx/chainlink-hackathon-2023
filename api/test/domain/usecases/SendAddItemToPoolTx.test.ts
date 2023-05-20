import { PoolWithoutItemsMock } from '../mocks/PoolMock';
import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { SendAddItemToPoolTx } from '../../../src/domain/usecases/SendAddItemToPoolTx';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';
import { ItemRepositoryStub } from '../stubs/ItemRepositoryStub';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';
import { MarketplaceContractServiceStub } from '../stubs/MarketplaceContractServiceStub';
import { ItemMock } from '../mocks/ItemMock';

const item = ItemMock;
let sendAddItemToPoolTx: SendAddItemToPoolTx;
let itemRepositoryStub: IItemRepository;
let poolRepositoryStub: IPoolRepository;
let marketplaceContractServiceStub: IMarketplaceContractService;

describe('SendSendAddItemToPoolTxTx UseCase', () => {
  beforeEach(() => {
    itemRepositoryStub = new ItemRepositoryStub();
    poolRepositoryStub = new PoolRepositoryStub();
    marketplaceContractServiceStub = new MarketplaceContractServiceStub();
    sendAddItemToPoolTx = new SendAddItemToPoolTx(
      itemRepositoryStub,
      poolRepositoryStub,
      marketplaceContractServiceStub,
    );
  });

  it('should throw if the item does not exist', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(null);
    const requestMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    const response = sendAddItemToPoolTx.execute(requestMock);
    await expect(response).rejects.toThrow('Item not Found');
  });

  it('should throw if the item is already in the pool', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: true });
    const requestMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    const response = sendAddItemToPoolTx.execute(requestMock);
    await expect(response).rejects.toThrow('Item is already in the pool');
  });

  it('should throw if ItemRepository throws', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockImplementationOnce(() => {
      throw new Error();
    });

    const requestMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    const response = sendAddItemToPoolTx.execute(requestMock);

    await expect(response).rejects.toThrow('An error occurred while trying to add item to pool');
  });

  it('should throw if the pool does not exist', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(item);
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(null);
    const requestMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    const response = sendAddItemToPoolTx.execute(requestMock);
    await expect(response).rejects.toThrow('Pool not Found');
  });

  it('should retry 3 times if marketplace contract service throws', async () => {
    const requestMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(item);
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolWithoutItemsMock);
    jest.spyOn(marketplaceContractServiceStub, 'addToPool').mockImplementation(() => {
      throw new Error('Error in contract service');
    });
    const response = sendAddItemToPoolTx.execute(requestMock);
    await expect(response).rejects.toThrow(
      'An error occurred while trying to add item to the pool in the marketplace contract',
    );
    expect(marketplaceContractServiceStub.addToPool).toBeCalledTimes(3);
  });
});
