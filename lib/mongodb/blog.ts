// lib/mongodb/blog.ts
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  scheduledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getAllPosts(publishedOnly = false): Promise<BlogPost[]> {
  const db = await getDatabase();
  const filter = publishedOnly ? { published: true } : {};
  return db
    .collection<BlogPost>('blog_posts')
    .find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDatabase();
  return db.collection<BlogPost>('blog_posts').findOne({ slug });
}

export async function createPost(
  data: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>
): Promise<BlogPost> {
  const db = await getDatabase();
  const now = new Date();
  const post: BlogPost = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<BlogPost>('blog_posts').insertOne(post);
  return { ...post, _id: result.insertedId };
}

export async function updatePost(
  slug: string,
  data: Partial<Omit<BlogPost, '_id' | 'createdAt'>>
): Promise<void> {
  const db = await getDatabase();
  await db.collection<BlogPost>('blog_posts').updateOne(
    { slug },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deletePost(slug: string): Promise<void> {
  const db = await getDatabase();
  await db.collection<BlogPost>('blog_posts').deleteOne({ slug });
}

export async function publishScheduledPosts(): Promise<number> {
  const db = await getDatabase();
  const now = new Date();
  const result = await db.collection<BlogPost>('blog_posts').updateMany(
    { published: false, scheduledAt: { $lte: now, $ne: null } },
    { $set: { published: true, publishedAt: now, updatedAt: now, scheduledAt: null } }
  );
  return result.modifiedCount;
}
