import { IItemRepository } from '../../../../domain/repositories/ItemRepository';
import { Item } from '../../../../domain/models/Item';
import { MongoHelper } from '../helpers/mongoHelper';
import { ObjectId } from 'mongodb';

export class ItemMongoRepository implements IItemRepository {
  async findById(itemId: string): Promise<Item | null> {
    const itemCollection = MongoHelper.getCollection('items');

    const aggregation = [
      {
        $match: {
          _id: new ObjectId(itemId),
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
    ];

    const result = await itemCollection.aggregate(aggregation).toArray();

    const item = result[0];

    if (item) {
      return MongoHelper.map(item);
    }

    return null;
  }

  async updateItem(item: Item): Promise<boolean> {
    const itemCollection = MongoHelper.getCollection('items');
    const result = await itemCollection.updateOne({ _id: new ObjectId(item.id) }, { $set: item });
    return result.modifiedCount > 0;
  }
}
