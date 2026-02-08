'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Target, Clock, Star, TrendingUp, TrendingDown,
  Minus, CheckCircle, XCircle
} from 'lucide-react'
import { ProRoute } from '@/components/global/ProRoute'

interface LessonAnalysis {
  lessonId: string;
  lessonName: string;
  totalSessions: number;
  totalDuration: number;
  totalAttempts: number;
  sentencesCompleted: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
  totalXP: number;
  phonemeBreakdown: Array<{
    phoneme: string;
    avgScore: number;
    attempts: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  sessionHistory: Array<{
    date: string;
    time: string;
    accuracy: number;
    duration: number;
    sentencesCompleted: number;
  }>;
}

export default function LessonAnalysisPage({ 
  params 
}: { 
  params: Promise<{ lessonId: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [analysis, setAnalysis] = useState<LessonAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLessonAnalysis()
  }, [resolvedParams.lessonId])

  const fetchLessonAnalysis = async () => {
    try {
      const response = await fetch(`/api/progress/lesson/${resolvedParams.lessonId}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProRoute>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ProRoute>
    )
  }

  if (!analysis) {
    return (
      <ProRoute>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
          <div className="alert alert-error">No data found for this lesson</div>
        </div>
      </ProRoute>
    )
  }

  return (
    <ProRoute>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <button 
          onClick={() => router.back()}
          className="btn btn-ghost btn-sm gap-2 mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Progress
        </button>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          {analysis.lessonName}
        </h1>
        <p className="text-sm sm:text-base text-base-content/70 mb-6 sm:mb-8">
          Detailed analysis of your performance
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {analysis.averageAccuracy}%
              </div>
              <div className="text-[10px] sm:text-xs opacity-70">Avg Accuracy</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-info mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {analysis.totalDuration}m
              </div>
              <div className="text-[10px] sm:text-xs opacity-70">Total Time</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-success mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {analysis.sentencesCompleted}
              </div>
              <div className="text-[10px] sm:text-xs opacity-70">Sentences</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md col-span-2 lg:col-span-1">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-warning mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {analysis.totalXP}
              </div>
              <div className="text-[10px] sm:text-xs opacity-70">Total XP</div>
            </div>
          </div>
        </div>

        {/* Phoneme Breakdown */}
        <div className="card bg-base-100 shadow-xl mb-6 sm:mb-8">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-base sm:text-lg mb-4">Phoneme Performance</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {analysis.phonemeBreakdown.map((phoneme, idx) => (
                <div key={idx} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm sm:text-base">
                        {phoneme.phoneme}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold">
                          {phoneme.avgScore}%
                        </span>
                        {phoneme.trend === 'up' && (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                        )}
                        {phoneme.trend === 'down' && (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-error" />
                        )}
                        {phoneme.trend === 'stable' && (
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-base-content/50" />
                        )}
                      </div>
                    </div>
                    <progress 
                      className={`progress w-full h-2 ${
                        phoneme.avgScore >= 85 ? 'progress-success' :
                        phoneme.avgScore >= 70 ? 'progress-warning' :
                        'progress-error'
                      }`}
                      value={phoneme.avgScore}
                      max="100"
                    ></progress>
                    <p className="text-[10px] sm:text-xs text-base-content/60 mt-1">
                      {phoneme.attempts} attempts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session History */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-base sm:text-lg mb-4">Session History</h2>
            
            <div className="overflow-x-auto">
              <table className="table table-xs sm:table-sm">
                <thead>
                  <tr className="text-[10px] sm:text-xs">
                    <th>Date & Time</th>
                    <th>Sentences</th>
                    <th>Duration</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.sessionHistory.map((session, idx) => (
                    <tr key={idx} className="hover">
                      <td>
                        <div className="text-[10px] sm:text-xs">
                          <div className="font-semibold">{session.date}</div>
                          <div className="opacity-60">{session.time}</div>
                        </div>
                      </td>
                      <td className="text-[10px] sm:text-xs">
                        {session.sentencesCompleted}
                      </td>
                      <td className="text-[10px] sm:text-xs">
                        {session.duration}m
                      </td>
                      <td>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <progress 
                            className={`progress w-12 sm:w-16 h-2 ${
                              session.accuracy >= 85 ? 'progress-success' :
                              session.accuracy >= 70 ? 'progress-warning' :
                              'progress-error'
                            }`}
                            value={session.accuracy}
                            max="100"
                          ></progress>
                          <span className="font-semibold text-[10px] sm:text-xs">
                            {session.accuracy}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProRoute>
  )
}