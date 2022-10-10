import { MongoClient } from 'mongodb';

declare global {
  const _mongoClientPromise: Promise<MongoClient>;
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      _mongoClientPromise: Promise<MongoClient>;
    }
  }
}
