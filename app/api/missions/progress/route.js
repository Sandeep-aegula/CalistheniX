import { connectDB } from '@/lib/mongodb'
import { allMissions } from '@/data/missionsSystem'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 })
    }

    // This would fetch from your User model
    // For now, returning a template response
    const mockUserData = {
      _id: userId,
      totalWorkouts: 0,
      xp: 0,
      currentStreak: 0,
      completedMissions: [],
      unlockedSkillBadges: [],
      unlockedMilestones: []
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

    mockUserData.completedMissions.forEach(completed => {
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
        totalWorkouts: mockUserData.totalWorkouts,
        totalXP: mockUserData.xp,
        currentStreak: mockUserData.currentStreak,
        completedMissions: mockUserData.completedMissions,
        unlockedSkillBadges: mockUserData.unlockedSkillBadges,
        unlockedMilestones: mockUserData.unlockedMilestones,
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
