import { IMarketplaceContractService, IRentItemResponse } from '../../../domain/services/MarketplaceContractService';
import { Item } from '../../../domain/models/Item';
import { Pool } from '../../../domain/models/Pool';
import { Rent } from '../../../domain/models/Rent';
import { ItemMock } from '../../../../test/domain/mocks/ItemMock';
import { ObjectId } from 'mongodb';

export class MarketplaceContractService implements IMarketplaceContractService {
  async addToPool(item: Item, pool: Pool): Promise<boolean> {
    // Simula uma chamada bem-sucedida ao smart contract.
    console.log('Item added to pool in smart contract', { item, pool });
    return true;
  }

  async rentItem(pool: Pool): Promise<IRentItemResponse> {
    // Simula uma chamada bem-sucedida ao smart contract.
    console.log('Item rented from pool in smart contract', { pool });
    const item = ItemMock;
    const rent: Rent = {
      id: new ObjectId('mockedRentId'),
      rentee: {
        id: new ObjectId('mockedRenterId'),
        username: 'mockedRenterName',
        walletAddress: 'walletAddress',
      },
      poolId: new ObjectId('poolId'),
      rentalStartDate: new Date(),
      itemId: new ObjectId('itemId'),
    };

    return {
      item,
      rent,
    };
  }

  async returnItem(item: Item, pool: Pool): Promise<Item> {
    // Simula uma chamada bem-sucedida ao smart contract.
    console.log('Item returned to pool in smart contract', { item, pool });

    // Simulando o item retornado do contrato
    return item;
  }

  async removeFromPool(item: Item, pool: Pool): Promise<boolean> {
    // Simula uma chamada bem-sucedida ao smart contract.
    console.log('Item removed from pool in smart contract', { item, pool });
    return true;
  }
}
