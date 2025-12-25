import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import { User, Skill } from '@/models'

export async function GET() {
  try {
    await dbConnect()
    
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with unlocked skills
    const user = await User.findOne({ email: session.user.email })
      .populate('unlockedSkills.skillId')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all skills
    const allSkills = await Skill.find({}).sort({ category: 1, difficulty: 1 })
    
    // Map user's unlocked skills for easy lookup
    const unlockedSkillsMap = new Map()
    user.unlockedSkills.forEach(us => {
      unlockedSkillsMap.set(us.skillId._id.toString(), us)
    })

    // Add user progress to skills
    const skillsWithProgress = allSkills.map(skill => ({
      ...skill.toObject(),
      isUnlocked: unlockedSkillsMap.has(skill._id.toString()),
      userProgress: unlockedSkillsMap.get(skill._id.toString()) || null
    }))

    return NextResponse.json({ skills: skillsWithProgress })

  } catch (error) {
    console.error('Get skills error:', error)
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

    const { skillId, performance } = await request.json()
    
    const user = await User.findOne({ email: session.user.email })
    const skill = await Skill.findById(skillId)
    
    if (!user || !skill) {
      return NextResponse.json({ error: 'User or skill not found' }, { status: 404 })
    }

    // Find or create unlocked skill entry
    let unlockedSkillIndex = user.unlockedSkills.findIndex(
      us => us.skillId.toString() === skillId
    )
    
    if (unlockedSkillIndex === -1) {
      // First time unlocking this skill
      user.unlockedSkills.push({
        skillId: skill._id,
        unlockedAt: new Date(),
        masteryLevel: 1,
        bestPerformance: performance
      })
    } else {
      // Update existing skill performance
      const unlockedSkill = user.unlockedSkills[unlockedSkillIndex]
      
      // Update best performance if better
      if (performance.reps > (unlockedSkill.bestPerformance.reps || 0)) {
        unlockedSkill.bestPerformance = performance
        
        // Check for mastery level increase
        const targetMet = performance.reps >= skill.targetReps
        if (targetMet && unlockedSkill.masteryLevel < 5) {
          unlockedSkill.masteryLevel += 1
        }
      }
    }

    // Award XP
    const xpEarned = Math.floor(skill.xpReward * (performance.reps / skill.targetReps))
    user.xp += xpEarned

    await user.save()

    return NextResponse.json({ 
      message: 'Skill progress updated',
      xpEarned,
      newXP: user.xp,
      newLevel: user.level
    })

  } catch (error) {
    console.error('Update skill progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}