// lib/mongodb/lessons.ts

import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export interface UserLessonSession {
  _id?: ObjectId
  userId: string
  lessonSessionId: string
  lessonId: string
  totalSentences: number
  averageAccuracy: number
  totalXP: number
  totalDurationSeconds: number
  completedAt: Date
}

export async function getUserLessonSessionsCollection() {
  const db = await getDatabase()
  return db.collection<UserLessonSession>('userLessonSessions')
}

export async function createLessonSession(session: UserLessonSession) {
  const collection = await getUserLessonSessionsCollection()
  return collection.insertOne(session)
}

export async function getLessonSessionsByUser(userId: string) {
  const collection = await getUserLessonSessionsCollection()
  return collection
    .find({ userId })
    .sort({ completedAt: -1 })
    .toArray()
}