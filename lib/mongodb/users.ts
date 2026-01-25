// lib/mongodb/users.ts
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  clerkId?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  plan?: string;
  creditsRemaining: number;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>('users').findOne({ clerkId });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>('users').findOne({ email });
}

export async function getUserByStripeCustomerId(customerId: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>('users').findOne({ stripeCustomerId: customerId });
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const db = await getDatabase();
  
  const newUser: User = {
    email: userData.email!,
    clerkId: userData.clerkId,
    stripeCustomerId: userData.stripeCustomerId,
    subscriptionId: userData.subscriptionId,
    subscriptionStatus: userData.subscriptionStatus,
    plan: userData.plan,
    creditsRemaining: userData.creditsRemaining ?? 0,
    isGuest: userData.isGuest ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection<User>('users').insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function updateUser(
  filter: { clerkId?: string; email?: string; stripeCustomerId?: string },
  update: Partial<User>
): Promise<void> {
  const db = await getDatabase();
  
  await db.collection<User>('users').updateOne(
    filter,
    { 
      $set: {
        ...update,
        updatedAt: new Date(),
      }
    }
  );
}

export async function upsertUser(
  filter: { clerkId?: string; email?: string; stripeCustomerId?: string },
  userData: Partial<User>
): Promise<void> {
  const db = await getDatabase();
  
  await db.collection<User>('users').updateOne(
    filter,
    { 
      $set: {
        ...userData,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );
}

export async function incrementUserCredits(
  userId: ObjectId | string,
  amount: number
): Promise<void> {
  const db = await getDatabase();
  
  await db.collection<User>('users').updateOne(
    { _id: typeof userId === 'string' ? new ObjectId(userId) : userId },
    { 
      $inc: { creditsRemaining: amount },
      $set: { updatedAt: new Date() }
    }
  );
}

export async function decrementUserCredits(
  clerkId: string,
  amount: number = 1
): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection<User>('users').updateOne(
    { 
      clerkId,
      creditsRemaining: { $gt: 0 } // Only decrement if they have credits
    },
    { 
      $inc: { creditsRemaining: -amount },
      $set: { updatedAt: new Date() }
    }
  );

  return result.modifiedCount > 0;
}