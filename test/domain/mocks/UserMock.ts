import { User } from '../../../src/domain/models/User';
import { ObjectId } from 'mongodb';

export const UserMockRenter: User = { id: new ObjectId(), walletAddress: 'user1' };
export const UserMockRentee: User = { id: new ObjectId(), walletAddress: 'user2' };
