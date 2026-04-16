/**
 * API Route: Reset All User Stats
 * Resets all user progress to zero for all users in the database
 */

import { User } from '@/models'
import dbConnect from '@/lib/mongodb'

export async function POST(req) {
  try {
    console.log('🔄 Reset ALL user stats API called')
    await dbConnect()

    // Reset all stats to zero/default for ALL users
    const result = await User.updateMany({}, {
      $set: {
        xp: 0,
        level: 1,
        missionLevel: 'beginner',
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        lastWorkout: null
      },
      $unset: {
        completedMissions: [],
        skillBadges: [],
        milestones: [],
        activeMissions: [],
        unlockedSkills: [],
        badges: [],
        workoutSessions: []
      }
    })

    console.log('✅ All user stats reset successfully')
    console.log(`📊 Updated ${result.modifiedCount} users`)

    return Response.json({
      success: true,
      message: `All stats reset to zero for ${result.modifiedCount} users`,
      stats: {
        usersUpdated: result.modifiedCount
      }
    })
  } catch (error) {
    console.error('Reset all error:', error)
    return Response.json(
      {
        error: 'Failed to reset all stats',
        details: error.message
      },
      { status: 500 }
    )
  }
}