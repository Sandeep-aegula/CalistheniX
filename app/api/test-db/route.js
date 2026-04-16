import dbConnect from '@/lib/mongodb'
import { Mission, User } from '@/models'

export async function GET() {
  try {
    await dbConnect()

    // Get all missions from database
    const dbMissions = await Mission.find({}).limit(10) // Limit to first 10 for testing

    // Get mission count
    const totalMissions = await Mission.countDocuments()

    // Get a sample user to see completed missions
    const sampleUser = await User.findOne({}).select('completedMissions xp level')

    return Response.json({
      success: true,
      databaseStatus: {
        totalMissionsInDB: totalMissions,
        sampleMissions: dbMissions.map(m => ({
          id: m._id,
          title: m.title,
          level: m.level,
          category: m.category,
          xpReward: m.xpReward,
          isActive: m.isActive
        })),
        sampleUser: sampleUser ? {
          id: sampleUser._id,
          xp: sampleUser.xp,
          level: sampleUser.level,
          completedMissionsCount: sampleUser.completedMissions?.length || 0,
          recentCompletions: sampleUser.completedMissions?.slice(-3).map(cm => ({
            missionId: cm.missionId,
            completedAt: cm.completedAt,
            xpEarned: cm.xpEarned
          })) || []
        } : null
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return Response.json(
      { error: 'Database test failed', details: error.message },
      { status: 500 }
    )
  }
}