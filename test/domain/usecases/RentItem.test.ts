import { RentItem } from '../../../src/domain/usecases/RentItem';
import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { ItemRepositoryStub } from '../stubs/ItemRepositoryStub';
import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';
import { MarketplaceContractServiceStub } from '../stubs/MarketplaceContractServiceStub';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';
import { PoolMock } from '../mocks/PoolMock';
import { ItemMock } from '../mocks/ItemMock';

describe('RentItem UseCase', () => {
  let itemRepositoryStub: IItemRepository;
  let poolRepositoryStub: IPoolRepository;
  let marketplaceContractServiceStub: IMarketplaceContractService;
  let rentItem: RentItem;

  beforeEach(() => {
    itemRepositoryStub = new ItemRepositoryStub();
    poolRepositoryStub = new PoolRepositoryStub();
    marketplaceContractServiceStub = new MarketplaceContractServiceStub();
    rentItem = new RentItem(itemRepositoryStub, poolRepositoryStub, marketplaceContractServiceStub);
  });

  it('should throw if the pool does not exist', async () => {
    const poolMock = { poolId: 'invalid_id', userWallet: 'valid_id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(null);

    await expect(rentItem.execute(poolMock)).rejects.toThrow('Pool not Found');
  });

  it('should throw if there is no item available does not exist', async () => {
    const poolMock = { poolId: 'invalid_id', userWallet: 'valid_id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolMock);

    await expect(rentItem.execute(poolMock)).rejects.toThrow('No available items in the pool');
  });

  it('should throw if marketplaceContractService throws', async () => {
    const poolMock = { poolId: 'valid_id', userWallet: 'valid_id' };

    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce({ ...PoolMock, availableItems: [ItemMock] });

    const rentItemSpy = jest.spyOn(marketplaceContractServiceStub, 'rentItem').mockImplementation(() => {
      throw new Error('Marketplace Contract Error');
    });

    await expect(rentItem.execute(poolMock)).rejects.toThrow(
      'An error occurred while trying to rent the item in the marketplace contract',
    );
    expect(rentItemSpy).toBeCalledTimes(3);
  });

  it('should rent the item if it is available', async () => {
    // Cria um mock para o item disponível
    const mockPool = {
      id: '1',
      availableItems: [ItemMock],
      rentedItems: [],
      itemCategory: {
        id: 'categoryId',
        name: 'name',
      },
      currentPrice: 1,
    };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(mockPool);
    jest.spyOn(marketplaceContractServiceStub, 'rentItem').mockResolvedValueOnce(ItemMock);
    jest.spyOn(itemRepositoryStub, 'updateItem').mockResolvedValueOnce(true);
    jest.spyOn(poolRepositoryStub, 'updatePool').mockResolvedValueOnce(true);

    const response = await rentItem.execute({ poolId: '1', userWallet: 'user1' });

    expect(response.item?.rented).toBeTruthy();
    expect(response.item?.rentedBy).toEqual({ walletAddress: 'user1' });
    expect(response.pool?.rentedItems).toContainEqual(ItemMock);
    expect(response.pool?.availableItems).not.toContainEqual(ItemMock);
  });
});
