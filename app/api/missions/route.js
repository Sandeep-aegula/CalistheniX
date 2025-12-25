import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import { User, Mission } from '@/models'

export async function GET() {
  try {
    await dbConnect()
    
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with active missions
    const user = await User.findOne({ email: session.user.email })
      .populate('activeMissions.missionId')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get available missions (active and not already completed by user)
    const completedMissionIds = user.completedMissions.map(cm => cm.missionId)
    const activeMissionIds = user.activeMissions.map(am => am.missionId)
    
    const availableMissions = await Mission.find({
      isActive: true,
      _id: { 
        $nin: [...completedMissionIds, ...activeMissionIds]
      }
    }).limit(10)

    return NextResponse.json({
      activeMissions: user.activeMissions,
      availableMissions,
      completedMissions: user.completedMissions.slice(-10) // Last 10 completed
    })

  } catch (error) {
    console.error('Get missions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { missionId } = await request.json()
    
    const user = await User.findOne({ email: session.user.email })
    const mission = await Mission.findById(missionId)
    
    if (!user || !mission) {
      return NextResponse.json({ error: 'User or mission not found' }, { status: 404 })
    }

    // Check if mission is already active or completed
    const isAlreadyActive = user.activeMissions.some(
      am => am.missionId.toString() === missionId
    )
    const isAlreadyCompleted = user.completedMissions.some(
      cm => cm.missionId.toString() === missionId
    )

    if (isAlreadyActive || isAlreadyCompleted) {
      return NextResponse.json({ error: 'Mission already started or completed' }, { status: 400 })
    }

    // Add mission to user's active missions
    user.activeMissions.push({
      missionId: mission._id,
      progress: mission.requirements.map(req => ({
        skillName: req.skillName,
        currentValue: 0,
        targetValue: req.targetValue,
        completed: false
      })),
      startedAt: new Date(),
      isCompleted: false
    })

    await user.save()

    return NextResponse.json({ message: 'Mission started successfully' })

  } catch (error) {
    console.error('Start mission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}