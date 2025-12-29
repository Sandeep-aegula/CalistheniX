/**
 * API Route: Complete Mission
 * Handles mission completion, XP rewards, prerequisites checking,
 * and achievement unlocking
 */

import { User, Mission } from '@/models'
import { connectDB } from '@/lib/mongodb'
import {
  skillBadges,
  milestoneAchievements,
  allMissions,
  xpMultipliers
} from '@/data/missionsSystem'

export async function POST(req) {
  try {
    await connectDB()

    const { userId, missionId, skillScores } = await req.json()

    if (!userId || !missionId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch user and mission
    const user = await User.findById(userId)
    const mission = await Mission.findById(missionId)

    if (!user || !mission) {
      return Response.json({ error: 'User or mission not found' }, { status: 404 })
    }

    // Check if mission already completed today
    const today = new Date().toDateString()
    const completedToday = user.completedMissions.find(
      (m) =>
        m.missionId.toString() === missionId &&
        new Date(m.completedAt).toDateString() === today
    )

    if (completedToday) {
      return Response.json(
        { error: 'Mission already completed today' },
        { status: 400 }
      )
    }

    // Add XP with level multiplier
    const missionData = allMissions.find(m => m.id === missionId)
    const baseXpReward = mission.xpReward || 25
    const multiplier = missionData ? xpMultipliers[missionData.level] || 1.0 : 1.0
    const xpReward = Math.floor(baseXpReward * multiplier)
    user.xp += xpReward

    // Update mission level based on completed missions
    const completedLevelSet = new Set()
    user.completedMissions.forEach(comp => {
      const missionInfo = allMissions.find(m => m.id === comp.missionId)
      if (missionInfo) completedLevelSet.add(missionInfo.level)
    })

    if (completedLevelSet.has('pro')) {
      user.missionLevel = 'pro'
    } else if (completedLevelSet.has('intermediate')) {
      user.missionLevel = 'intermediate'
    } else if (completedLevelSet.has('fat-burn')) {
      user.missionLevel = 'fat-burn'
    } else {
      user.missionLevel = 'beginner'
    }

    // Track mission completion
    user.completedMissions.push({
      missionId,
      completedAt: new Date(),
      xpEarned: xpReward
    })

    // Update streak
    const lastWorkout = user.lastWorkout
    const today_date = new Date()
    const yesterday = new Date(today_date.getTime() - 24 * 60 * 60 * 1000)

    if (
      lastWorkout &&
      lastWorkout.toDateString() === yesterday.toDateString()
    ) {
      // Streak continues
      user.currentStreak += 1
    } else if (
      !lastWorkout ||
      lastWorkout.toDateString() !== today_date.toDateString()
    ) {
      // New streak
      user.currentStreak = 1
    }

    // Update longest streak
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak
    }

    user.lastWorkout = new Date()
    user.totalWorkouts += 1

    // ==================== CHECK SKILL BADGE UNLOCKS ====================

    const newBadges = []
    for (const badge of skillBadges) {
      // Check if already earned
      const alreadyEarned = user.skillBadges.some(
        (b) => b.badgeId === badge.id
      )
      if (alreadyEarned) continue

      // Check if unlock condition is met
      const { completedMissions: requiredMissions, minCompletions } = badge.requirements
      const meetsCondition = requiredMissions.every((reqMissionId) => {
        const completed = user.completedMissions.filter(
          (m) => m.missionId === reqMissionId
        ).length
        return completed >= minCompletions
      })

      if (meetsCondition) {
        user.skillBadges.push({
          badgeId: badge.id,
          earnedAt: new Date(),
          category: badge.category
        })
        newBadges.push(badge)
      }
    }

    // ==================== CHECK MILESTONE UNLOCKS ====================

    const newMilestones = []
    for (const milestone of milestoneAchievements) {
      // Check if already earned
      const alreadyEarned = user.milestones.some(
        (m) => m.milestoneId === milestone.id
      )
      if (alreadyEarned) continue

      const { requirements } = milestone
      let isMet = true

      if (requirements.totalWorkouts) {
        isMet = isMet && user.totalWorkouts >= requirements.totalWorkouts
      }
      if (requirements.xp) {
        isMet = isMet && user.xp >= requirements.xp
      }
      if (requirements.consecutiveDays) {
        isMet = isMet && user.currentStreak >= requirements.consecutiveDays
      }
      if (requirements.skillBadges) {
        isMet = isMet && user.skillBadges.length >= requirements.skillBadges
      }
      if (requirements.completedLevels) {
        const completedLevelSet = new Set()
        user.completedMissions.forEach(comp => {
          const missionInfo = allMissions.find(m => m.id === comp.missionId)
          if (missionInfo) completedLevelSet.add(missionInfo.level)
        })
        isMet = isMet && requirements.completedLevels.every(level => 
          completedLevelSet.has(level)
        )
      }

      if (isMet) {
        user.milestones.push({
          milestoneId: milestone.id,
          earnedAt: new Date(),
          title: milestone.title,
          xpBonus: milestone.xpBonus
        })

        // Add milestone XP bonus
        user.xp += milestone.xpBonus
        newMilestones.push(milestone)
      }
    }

    // Save user
    await user.save()

    return Response.json({
      success: true,
      user: {
        xp: user.xp,
        level: user.level,
        missionLevel: user.missionLevel,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalWorkouts: user.totalWorkouts
      },
      rewards: {
        xpEarned: xpReward,
        newBadges,
        newMilestones
      }
    })
  } catch (error) {
    console.error('Mission completion error:', error)
    return Response.json(
      { error: 'Failed to complete mission', details: error.message },
      { status: 500 }
    )
  }
}
