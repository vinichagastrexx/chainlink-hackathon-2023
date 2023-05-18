import { PoolMock } from './../mocks/PoolMock';
import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { FinishAddItemToPoolOp } from '../../../src/domain/usecases/FinishAddItemToPoolOp';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { ItemRepositoryStub } from '../stubs/ItemRepositoryStub';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';
import { ItemMock } from '../mocks/ItemMock';

const item = ItemMock;
let finishAddItemToPoolOp: FinishAddItemToPoolOp;
let itemRepositoryStub: IItemRepository;
let poolRepositoryStub: IPoolRepository;

describe('Finish Add Item To Pool Operation UseCase', () => {
  beforeEach(() => {
    itemRepositoryStub = new ItemRepositoryStub();
    poolRepositoryStub = new PoolRepositoryStub();
    finishAddItemToPoolOp = new FinishAddItemToPoolOp(itemRepositoryStub, poolRepositoryStub);
  });

  it('should throw if the item does not exist', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(null);
    const itemMock = { itemId: 'invalid_id', poolId: 'valid_pool_id' };
    const response = finishAddItemToPoolOp.execute(itemMock);
    await expect(response).rejects.toThrow('Item not Found');
  });

  it('should throw if the item is already in the pool', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce({ ...item, isInPool: true });
    const itemMock = { itemId: 'already_in_pool_id', poolId: 'valid_pool_id' };
    const response = finishAddItemToPoolOp.execute(itemMock);
    await expect(response).rejects.toThrow('Item is already in the pool');
  });

  it('should throw if the pool does not exist', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(ItemMock);
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(null);
    const itemMock = { itemId: 'valid_id', poolId: 'invalid_pool_id' };
    const response = finishAddItemToPoolOp.execute(itemMock);
    await expect(response).rejects.toThrow('Pool not Found');
  });

  it('should throw if PoolRepository throws', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(ItemMock);
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolMock);
    jest.spyOn(itemRepositoryStub, 'updateItem').mockResolvedValueOnce(true);
    jest.spyOn(poolRepositoryStub, 'addItemToPool').mockImplementationOnce(() => {
      throw new Error();
    });

    const itemMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    const promise = finishAddItemToPoolOp.execute(itemMock);

    await expect(promise).rejects.toThrow('An error occurred while adding item to pool');
  });

  it('should add the item to the pool if it exists and it is not in the pool', async () => {
    jest.spyOn(itemRepositoryStub, 'findById').mockResolvedValueOnce(ItemMock);
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolMock);
    jest.spyOn(itemRepositoryStub, 'updateItem').mockResolvedValueOnce(true);
    jest.spyOn(poolRepositoryStub, 'addItemToPool').mockResolvedValueOnce({ ...PoolMock, availableItems: [ItemMock] });
    const itemMock = { itemId: 'valid_id', poolId: 'valid_pool_id' };
    const response = await finishAddItemToPoolOp.execute(itemMock);
    expect(response.item.isInPool).toBe(true);
  });
});
