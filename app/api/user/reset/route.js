/**
 * API Route: Reset User Stats
 * Resets all user progress to zero for testing purposes
 */

import { User } from '@/models'
import dbConnect from '@/lib/mongodb'

export async function POST(req) {
  try {
    console.log('🔄 Reset user stats API called')
    await dbConnect()

    const { userId } = await req.json()

    if (!userId) {
      return Response.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Fetch user from database
    const user = await User.findById(userId)
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Reset all stats to zero/default
    user.xp = 0
    user.level = 1
    user.missionLevel = 'beginner'
    user.currentStreak = 0
    user.longestStreak = 0
    user.totalWorkouts = 0
    user.completedMissions = []
    user.skillBadges = []
    user.milestones = []
    user.lastWorkout = null

    await user.save()

    console.log('✅ User stats reset successfully for:', user.email)

    return Response.json({
      success: true,
      message: 'All stats reset to zero',
      user: {
        xp: user.xp,
        level: user.level,
        missionLevel: user.missionLevel,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalWorkouts: user.totalWorkouts
      }
    })
  } catch (error) {
    console.error('Reset error:', error)
    return Response.json(
      { 
        error: 'Failed to reset stats', 
        details: error.message
      },
      { status: 500 }
    )
  }
}
