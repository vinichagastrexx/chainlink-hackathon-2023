import { ObjectId } from 'mongodb';

export interface Pool {
  id: ObjectId;
  availableItems: ObjectId[];
  rentedItems: ObjectId[];
  categoryId: ObjectId;
}
