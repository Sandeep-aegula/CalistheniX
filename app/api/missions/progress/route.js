import dbConnect from '@/lib/mongodb'
import { User } from '@/models'
import { allMissions } from '@/data/missionsSystem'

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Fetch real user data from database
    const user = await User.findById(userId)
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate progress
    const completedLevels = new Set()
    const categoryProgress = {
      push: 0,
      pull: 0,
      core: 0,
      legs: 0,
      combination: 0,
      endurance: 0,
      leverage: 0
    }

    user.completedMissions.forEach(completed => {
      const mission = allMissions.find(m => m.id === completed.missionId)
      if (mission) {
        completedLevels.add(mission.level)
        if (categoryProgress.hasOwnProperty(mission.category)) {
          categoryProgress[mission.category]++
        }
      }
    })

    return Response.json({
      success: true,
      progress: {
        totalWorkouts: user.totalWorkouts || 0,
        totalXP: user.xp || 0,
        level: user.level || 1,
        currentStreak: user.currentStreak || 0,
        longestStreak: user.longestStreak || 0,
        completedMissions: user.completedMissions || [],
        skillBadges: user.skillBadges || [],
        milestones: user.milestones || [],
        completedLevels: Array.from(completedLevels),
        categoryProgress,
        totalMissionsAvailable: allMissions.length
      }
    })
  } catch (error) {
    console.error('Get progress error:', error)
    return Response.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
