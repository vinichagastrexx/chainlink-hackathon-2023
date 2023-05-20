import { IPoolRepository } from '../../../../domain/repositories/PoolRepository';
import { Pool } from '../../../../domain/models/Pool';
import { MongoHelper } from '../helpers/mongoHelper';
import { ObjectId } from 'mongodb';
import { Item } from '../../../../domain/models/Item';

export class PoolMongoRepository implements IPoolRepository {
  async addPool(pool: Pool): Promise<Pool> {
    const poolCollection = MongoHelper.getCollection('pools');
    const result = await poolCollection.insertOne(pool);
    const insertedPool = await poolCollection.findOne({ _id: result.insertedId });
    return MongoHelper.map(insertedPool);
  }

  async checkItemInPool(itemId: string, poolId: string): Promise<boolean> {
    const poolCollection = await MongoHelper.getCollection('pools');
    const pool = await poolCollection.findOne({
      _id: new ObjectId(poolId),
    });
    return pool?.availableItems.some((itemInPoolId: ObjectId) => itemInPoolId.equals(new ObjectId(itemId)));
  }

  async updatePool(pool: Pool): Promise<boolean> {
    const itemCollection = MongoHelper.getCollection('pools');
    const result = await itemCollection.updateOne({ _id: new ObjectId(pool.id) }, { $set: pool });
    return result.modifiedCount > 0;
  }

  async getAll(): Promise<Pool[]> {
    const poolCollection = MongoHelper.getCollection('pools');
    const pools = await poolCollection.find().toArray();
    return pools.map((pool) => MongoHelper.map(pool));
  }

  async getById(poolId: string): Promise<Pool | null> {
    const poolCollection = MongoHelper.getCollection('pools');
    const pool = await poolCollection.findOne({ _id: new ObjectId(poolId) });
    return pool && MongoHelper.map(pool);
  }

  async addItemToPool(itemId: string, poolId: string): Promise<Pool> {
    const poolCollection = MongoHelper.getCollection('pools');
    await poolCollection.updateOne(
      { _id: new ObjectId(poolId) },
      { $addToSet: { availableItems: new ObjectId(itemId) } },
    );
    return (await this.getById(poolId)) as Pool;
  }

  async removeItemFromPool(item: Item, poolId: string): Promise<boolean> {
    const poolCollection = MongoHelper.getCollection('pools');
    const result = await poolCollection.updateOne(
      { _id: new ObjectId(poolId) },
      { $pull: { availableItems: { id: item.id } } },
    );
    return result.modifiedCount > 0;
  }

  async removePool(poolId: string): Promise<boolean> {
    const poolCollection = MongoHelper.getCollection('pools');
    const result = await poolCollection.deleteOne({ _id: new ObjectId(poolId) });
    return result.deletedCount > 0;
  }
}
