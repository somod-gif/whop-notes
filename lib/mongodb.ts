import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {
  // Fix write concern issue
  writeConcern: {
    w: 'majority',
    wtimeout: 5000,
    j: true
  }
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export interface Note {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotesCollection() {
  const client = await clientPromise;
  const db = client.db(); // Use database from connection string
  return db.collection<Note>('whop-notes');
}