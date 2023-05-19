import { User } from '../models/User';

export interface IUserRepository {
  addUser(user: User): Promise<User>;
  removeUser(userId: string): Promise<boolean>;
  getById(userId: string): Promise<User | null>;
  getByWallet(walletAddress: string): Promise<User | null>;
  getAll(): Promise<User[]>;
}
