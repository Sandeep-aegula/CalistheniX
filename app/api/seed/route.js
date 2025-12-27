import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Skill, Mission } from '@/models'
import { initialSkills, initialMissions } from '@/data/gameData'

export async function POST(request) {
  try {
    await dbConnect()
    
    // Check if skills already exist to avoid duplicates
    const existingSkills = await Skill.countDocuments()
    const existingMissions = await Mission.countDocuments()
    
    let skillsCreated = 0
    let missionsCreated = 0
    
    // Seed skills if none exist
    if (existingSkills === 0) {
      console.log('Seeding skills...')
      
      for (const skillData of initialSkills) {
        const existingSkill = await Skill.findOne({ name: skillData.name })
        if (!existingSkill) {
          const skill = new Skill(skillData)
          await skill.save()
          skillsCreated++
        }
      }
      
      console.log(`Created ${skillsCreated} skills`)
    }
    
    // Seed missions if none exist
    if (existingMissions === 0) {
      console.log('Seeding missions...')
      
      for (const missionData of initialMissions) {
        const existingMission = await Mission.findOne({ title: missionData.title })
        if (!existingMission) {
          const mission = new Mission(missionData)
          await mission.save()
          missionsCreated++
        }
      }
      
      console.log(`Created ${missionsCreated} missions`)
    }
    
    return NextResponse.json({ 
      message: 'Database seeded successfully',
      skillsCreated,
      missionsCreated,
      existingSkills,
      existingMissions
    })

  } catch (error) {
    console.error('Seed database error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}