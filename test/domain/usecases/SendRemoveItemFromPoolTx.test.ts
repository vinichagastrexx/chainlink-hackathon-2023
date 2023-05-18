import { ItemMock } from './../mocks/ItemMock';
import { SendRemoveItemFromPoolTx } from './../../../src/domain/usecases/SendRemoveItemFromPoolTx';
import { IPoolRepository } from '../../../src/domain/repositories/PoolRepository';
import { IMarketplaceContractService } from '../../../src/domain/services/MarketplaceContractService';
import { PoolRepositoryStub } from '../stubs/PoolRepositoryStub';
import { MarketplaceContractServiceStub } from '../stubs/MarketplaceContractServiceStub';
import { PoolMock } from '../mocks/PoolMock';

let sendRemoveItemFromPoolTx: SendRemoveItemFromPoolTx;
let poolRepositoryStub: IPoolRepository;
let marketplaceContractServiceStub: IMarketplaceContractService;

describe('Remove Item from Pool UseCase', () => {
  beforeEach(() => {
    poolRepositoryStub = new PoolRepositoryStub();
    marketplaceContractServiceStub = new MarketplaceContractServiceStub();
    sendRemoveItemFromPoolTx = new SendRemoveItemFromPoolTx(poolRepositoryStub, marketplaceContractServiceStub);
  });

  it('should throw if the pool does not exist', async () => {
    const requestMock = { poolId: 'invalid_id', userWallet: 'valid_id', itemId: 'item-id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(null);

    await expect(sendRemoveItemFromPoolTx.execute(requestMock)).rejects.toThrow('Pool not Found');
  });

  it('should throw if the item is not in the available items list', async () => {
    const requestMock = { poolId: 'invalid_id', userWallet: 'valid_id', itemId: 'item-id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce(PoolMock);
    const response = sendRemoveItemFromPoolTx.execute(requestMock);
    await expect(response).rejects.toThrow('Item not found in the list of available itens');
  });

  it('should retry 3 times if marketplace contract service throws', async () => {
    const requestMock = { poolId: 'invalid_id', userWallet: 'walletAdress', itemId: 'valid_id' };
    jest.spyOn(poolRepositoryStub, 'getById').mockResolvedValueOnce({ ...PoolMock, availableItems: [ItemMock] });
    jest.spyOn(marketplaceContractServiceStub, 'removeFromPool').mockImplementation(() => {
      throw new Error('Error in contract service');
    });
    const promise = sendRemoveItemFromPoolTx.execute(requestMock);
    await expect(promise).rejects.toThrow(
      'An error occurred while trying to remove the item from the marketplace contract',
    );
    expect(marketplaceContractServiceStub.removeFromPool).toBeCalledTimes(3);
  });
});
