import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Skill, Mission, User } from '@/models'
import { initialSkills, initialMissions } from '@/data/gameData'
import { allMissions, skillBadges, milestoneAchievements } from '@/data/missionsSystem'

export async function POST(request) {
  try {
    await dbConnect()
    
    // 1. RESET ALL USER XP AND LEVELS TO ZERO
    console.log('🔄 Resetting user XP and levels...')
    const resetResult = await User.updateMany(
      {},
      {
        $set: {
          xp: 0,
          level: 1,
          missionLevel: 'beginner',
          currentStreak: 0,
          longestStreak: 0,
          totalWorkouts: 0,
          skillBadges: [],
          milestones: [],
          badges: []
        }
      }
    )
    console.log(`Reset XP/levels for ${resetResult.modifiedCount} users`)
    
    // 2. CLEAR AND SEED MISSIONS FROM MISSION SYSTEM
    console.log('🎯 Seeding missions from missionsSystem...')
    
    // Clear existing missions
    await Mission.deleteMany({})
    console.log('Cleared existing missions')
    
    // Seed all missions from missionsSystem
    let missionsCreated = 0
    for (const mission of allMissions) {
      try {
        const missionData = {
          title: mission.title,
          description: mission.description,
          level: mission.level,
          category: mission.category,
          difficulty: mission.difficulty,
          day: mission.day,
          emoji: mission.emoji,
          requirements: mission.requirements,
          xpReward: mission.xpReward,
          badgeReward: mission.badgeReward,
          prerequisites: mission.prerequisites || [],
          skills: mission.skills || [],
          type: 'weekly',
          isActive: true
        }
        
        console.log(`Creating mission: ${mission.title} with category: ${mission.category}`)
        const newMission = new Mission(missionData)
        await newMission.save()
        missionsCreated++
      } catch (error) {
        console.error(`Error creating mission ${mission.title}:`, error.message)
        throw error // Re-throw to stop the process
      }
    }
    console.log(`✅ Created ${missionsCreated} missions from missionsSystem`)
    
    // 3. SEED SKILLS
    console.log('💪 Seeding skills...')
    const existingSkills = await Skill.countDocuments()
    let skillsCreated = 0
    
    if (existingSkills === 0) {
      for (const skillData of initialSkills) {
        const existingSkill = await Skill.findOne({ name: skillData.name })
        if (!existingSkill) {
          const skill = new Skill(skillData)
          await skill.save()
          skillsCreated++
        }
      }
      console.log(`✅ Created ${skillsCreated} skills`)
    } else {
      console.log(`⏭️  Skills already exist (${existingSkills} found), skipping...`)
    }
    
    return NextResponse.json({ 
      message: 'Database reset and seeded successfully',
      usersReset: resetResult.modifiedCount,
      missionsCreated,
      skillsCreated,
      status: 'success'
    })

  } catch (error) {
    console.error('Seed database error:', error)
    return NextResponse.json({ error: error.message || 'Failed to seed database' }, { status: 500 })
  }
}