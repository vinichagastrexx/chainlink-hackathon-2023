import { User } from '../models/User';
import { IUserRepository } from '../repositories/UserRepository';
import { randomUUID } from 'crypto';

interface IRequest {
  walletAddress: string;
  email?: string;
  username?: string;
}

interface IResponse {
  user: User | null;
  error?: Error;
}

export class AddUser {
  constructor(private userRepository: IUserRepository) {}

  async execute({ walletAddress, email, username }: IRequest): Promise<IResponse> {
    const existingUser = await this.userRepository.getByWallet(walletAddress);

    if (existingUser) {
      return {
        user: null,
        error: new Error('User with this wallet address already exists'),
      };
    }

    const user: User = {
      walletAddress,
      email,
      username,
      id: randomUUID(),
    };

    const savedUser = await this.userRepository.addUser(user);

    return {
      user: savedUser,
    };
  }
}
