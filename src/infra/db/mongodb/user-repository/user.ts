import { IUserRepository } from '../../../../domain/repositories/UserRepository';
import { User } from '../../../../domain/models/User';
import { MongoHelper } from '../helpers/mongoHelper';
import { ObjectId } from 'mongodb';

export class UserMongoRepository implements IUserRepository {
  async addUser(user: User): Promise<User> {
    const usersCollection = MongoHelper.getCollection('users');
    const result = await usersCollection.insertOne(user);
    const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
    return MongoHelper.map(insertedUser);
  }

  async getAll(): Promise<User[]> {
    return Promise.resolve([]);
  }

  async getById(userId: string): Promise<User | null> {
    return null;
  }

  async getByWallet(walletAddress: string): Promise<User | null> {
    const usersCollection = MongoHelper.getCollection('users');
    const user = await usersCollection.findOne({ walletAddress });
    return user && MongoHelper.map(user);
  }

  async removeUser(userId: string): Promise<boolean> {
    const usersCollection = MongoHelper.getCollection('users');
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }
}
