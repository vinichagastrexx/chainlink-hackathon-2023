import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },

  getCollection(name: string): Collection {
    return this.client.db('chainlink-hackathon').collection(name);
  },

  map<T>(collection: any): T {
    const { _id, ...collectionWithoutId } = collection;
    return { ...collectionWithoutId, id: _id.toString() };
  },
};
