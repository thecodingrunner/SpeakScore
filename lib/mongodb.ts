// lib/mongodb.ts
// MongoDB connection for SpeakScore database

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

const uri = process.env.MONGODB_URI;

console.log(uri);

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  // across module reloads caused by HMR (Hot Module Replacement)
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db('speakscore'); // Your database name
}

// Helper to get specific collections
export async function getSentencesCollection() {
  const db = await getDatabase();
  return db.collection('sentences');
}

export async function getUserProgressCollection() {
  const db = await getDatabase();
  return db.collection('user_progress');
}

export async function getUserSentenceHistoryCollection() {
  const db = await getDatabase();
  return db.collection('user_sentence_history');
}