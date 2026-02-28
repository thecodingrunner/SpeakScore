import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/db'
import { getUserByClerkId } from '@/lib/mongodb/users'
import { getTierFromPlan, LESSON_LIMITS } from '@/lib/plan-config'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getUserByClerkId(userId)
  const plan = user?.plan || 'free'
  const tier = getTierFromPlan(plan)
  const limits = LESSON_LIMITS[tier]

  // Unlimited — no need to count
  if (limits.max === null) {
    return NextResponse.json({
      tier,
      used: 0,
      max: null,
      remaining: null,
      period: null,
      resetDate: null,
    })
  }

  // Determine period start
  const now = new Date()
  let periodStart: Date

  if (limits.period === 'week') {
    // ISO week starts on Monday
    const day = now.getDay() // 0=Sun, 1=Mon...
    const diff = (day === 0 ? -6 : 1 - day)
    periodStart = new Date(now)
    periodStart.setDate(now.getDate() + diff)
    periodStart.setHours(0, 0, 0, 0)
  } else {
    // Month starts on the 1st
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
  }

  // Count completed lessons in period
  const db = await getDatabase()
  const used = await db.collection('userLessonSessions').countDocuments({
    userId,
    completedAt: { $gte: periodStart },
  })

  const remaining = Math.max(limits.max - used, 0)

  // Calculate reset date
  let resetDate: string
  if (limits.period === 'week') {
    const nextMonday = new Date(periodStart)
    nextMonday.setDate(periodStart.getDate() + 7)
    resetDate = nextMonday.toISOString()
  } else {
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    resetDate = nextMonth.toISOString()
  }

  return NextResponse.json({
    tier,
    used,
    max: limits.max,
    remaining,
    period: limits.period,
    resetDate,
  })
}
