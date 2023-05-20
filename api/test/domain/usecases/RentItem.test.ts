import { RentItem } from '../../../src/domain/usecases/RentItem';
import { IItemRepository } from '../../../src/domain/repositories/ItemRepository';
import { ItemRepositoryStub } from '../stubs/ItemRepositoryStub';
import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';
import { MarketplaceContractServiceStub } from '../stubs/MarketplaceContractServiceStub';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';
import { PoolWithItemsMock, PoolWithoutItemsMock } from '../mocks/PoolMock';
import { ItemMock } from '../mocks/ItemMock';
import { RentRepositoryStub } from '../stubs/RentRepositoryStub';
import { IRentRepository } from '../../../src/domain/repositories/RentRepository';
import { RentMock } from '../mocks/RentMock';
import { UserMockRentee } from '../mocks/UserMock';

describe('RentItem UseCase', () => {
  let itemRepositoryStub: IItemRepository;
  let poolRepositoryStub: IPoolRepository;
  let marketplaceContractServiceStub: IMarketplaceContractService;
  let rentItem: RentItem;
  let rentRepositoryStub: IRentRepository;

  beforeEach(() => {
    itemRepositoryStub = new ItemRepositoryStub();
    poolRepositoryStub = new PoolRepositoryStub();
    rentRepositoryStub = new RentRepositoryStub();
    marketplaceContractServiceStub = new MarketplaceContractServiceStub();
    rentItem = new RentItem(itemRepositoryStub, poolRepositoryStub, marketplaceContractServiceStub, rentRepositoryStub);
  });

  it('should throw if the pool does not exist', async () => {
    const poolMock = { poolId: 'invalid_id', userWallet: 'valid_id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(null);

    await expect(rentItem.execute(poolMock)).rejects.toThrow('Pool not Found');
  });

  it('should throw if there is no item available does not exist', async () => {
    const poolMock = { poolId: 'invalid_id', userWallet: 'valid_id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolWithoutItemsMock);

    await expect(rentItem.execute(poolMock)).rejects.toThrow('No available items in the pool');
  });

  it('should throw if marketplaceContractService throws', async () => {
    const poolMock = { poolId: 'valid_id', userWallet: 'valid_id' };

    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolWithItemsMock);

    const rentItemSpy = jest.spyOn(marketplaceContractServiceStub, 'rentItem').mockImplementation(() => {
      throw new Error('Marketplace Contract Error');
    });

    await expect(rentItem.execute(poolMock)).rejects.toThrow('Unable to rent item after multiple attempts');
    expect(rentItemSpy).toBeCalledTimes(3);
  });

  it('should save the rent in the repository', async () => {
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolWithItemsMock);
    jest.spyOn(marketplaceContractServiceStub, 'rentItem').mockResolvedValueOnce({
      item: ItemMock,
      rent: {
        ...RentMock,
        rentee: UserMockRentee,
      },
    });
    jest.spyOn(itemRepositoryStub, 'updateItem').mockResolvedValueOnce(true);
    jest.spyOn(poolRepositoryStub, 'updatePool').mockResolvedValueOnce(true);
    jest.spyOn(rentRepositoryStub, 'initRent').mockResolvedValueOnce(true);

    const response = await rentItem.execute({ poolId: '1', userWallet: UserMockRentee.walletAddress });

    expect(response.rent.rentalStartDate).toBeDefined();
    expect(response.rent.rentee).toEqual(UserMockRentee);
    expect(response.item).toEqual({ ...ItemMock, rented: true, rentedBy: UserMockRentee });
  });
});
