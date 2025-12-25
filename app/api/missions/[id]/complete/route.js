import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import { User, Mission } from '@/models'

export async function POST(request, { params }) {
  try {
    await dbConnect()
    
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: missionId } = params
    
    const user = await User.findOne({ email: session.user.email })
    const mission = await Mission.findById(missionId)
    
    if (!user || !mission) {
      return NextResponse.json({ error: 'User or mission not found' }, { status: 404 })
    }

    // Find the active mission
    const activeMissionIndex = user.activeMissions.findIndex(
      am => am.missionId.toString() === missionId
    )
    
    if (activeMissionIndex === -1) {
      return NextResponse.json({ error: 'Mission not active' }, { status: 400 })
    }

    const activeMission = user.activeMissions[activeMissionIndex]
    
    // Check if all requirements are completed
    const allCompleted = activeMission.progress.every(p => p.completed)
    
    if (!allCompleted) {
      return NextResponse.json({ error: 'Mission requirements not met' }, { status: 400 })
    }

    // Mark mission as completed
    activeMission.isCompleted = true
    activeMission.completedAt = new Date()

    // Move to completed missions
    user.completedMissions.push({
      missionId: mission._id,
      completedAt: new Date(),
      xpEarned: mission.xpReward
    })

    // Remove from active missions
    user.activeMissions.splice(activeMissionIndex, 1)

    // Award XP
    user.xp += mission.xpReward
    user.totalWorkouts += 1

    // Check for badge rewards
    if (mission.badgeReward) {
      // Logic to award badge would go here
    }

    await user.save()

    return NextResponse.json({ 
      message: 'Mission completed successfully',
      xpEarned: mission.xpReward,
      newXP: user.xp,
      newLevel: user.level
    })

  } catch (error) {
    console.error('Complete mission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}