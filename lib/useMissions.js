/**
 * Custom Hook: useMissions
 * Manages mission state, prerequisites checking, and completion logic
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  categorizedMissions,
  missionLevels,
  levelDetails,
  getMissionsForLevel,
  checkPrerequisitesMet,
  getLevelFromXP,
  skillBadges,
  milestoneAchievements
} from '@/data/missionLevels'

export const useMissions = (userProgress = {}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [completionData, setCompletionData] = useState(null)

  // Get current level based on XP
  const getCurrentLevel = useCallback(() => {
    return getLevelFromXP(userProgress.xp || 0)
  }, [userProgress.xp])

  // Get all missions for current user
  const getAvailableMissions = useCallback(() => {
    const currentLevel = getCurrentLevel()
    const missions = getMissionsForLevel(currentLevel)

    return missions.filter((mission) =>
      checkPrerequisitesMet(mission, userProgress)
    )
  }, [userProgress, getCurrentLevel])

  // Get locked missions (don't meet prerequisites)
  const getLockedMissions = useCallback(() => {
    const currentLevel = getCurrentLevel()
    const missions = getMissionsForLevel(currentLevel)

    return missions.filter(
      (mission) => !checkPrerequisitesMet(mission, userProgress)
    )
  }, [userProgress, getCurrentLevel])

  // Get all missions across all levels
  const getAllMissionsInfo = useCallback(() => {
    return Object.entries(categorizedMissions).map(([level, data]) => ({
      level,
      levelDetails: levelDetails[level],
      missions: data.missions,
      available: data.missions.filter((mission) =>
        checkPrerequisitesMet(mission, userProgress)
      ),
      locked: data.missions.filter(
        (mission) => !checkPrerequisitesMet(mission, userProgress)
      )
    }))
  }, [userProgress])

  // Complete a mission
  const completeMission = useCallback(
    async (missionId, skillScores = {}) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/missions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userProgress.userId,
            missionId,
            skillScores
          })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to complete mission')
        }

        const data = await response.json()
        setCompletionData(data)
        return data
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [userProgress]
  )

  // Get mission prerequisites status
  const getMissionPrerequisites = useCallback((mission) => {
    if (!mission.prerequisites || mission.prerequisites.length === 0) {
      return null
    }

    return mission.prerequisites.map((prerequisite) => {
      const completedMissions = (
        userProgress.completedMissions || []
      ).filter((m) => m.missionId === prerequisite.missionId)

      return {
        missionId: prerequisite.missionId,
        required: prerequisite.minCompletions || 1,
        completed: completedMissions.length,
        isMet: completedMissions.length >= (prerequisite.minCompletions || 1)
      }
    })
  }, [userProgress.completedMissions])

  // Get all badges with unlock status
  const getBadgesStatus = useCallback(() => {
    const earnedBadgeIds = (userProgress.skillBadges || []).map(
      (b) => b.badgeId
    )

    return skillBadges.map((badge) => ({
      ...badge,
      isEarned: earnedBadgeIds.includes(badge.id),
      earnedAt: (userProgress.skillBadges || []).find(
        (b) => b.badgeId === badge.id
      )?.earnedAt
    }))
  }, [userProgress.skillBadges])

  // Get all milestones with progress
  const getMilestonesStatus = useCallback(() => {
    const earnedMilestoneIds = (userProgress.milestones || []).map(
      (m) => m.milestoneId
    )

    return milestoneAchievements.map((milestone) => {
      const isEarned = earnedMilestoneIds.includes(milestone.id)

      let progress = 0
      let total = 1

      if (milestone.condition.totalMissionsCompleted) {
        progress = Math.min(
          userProgress.totalMissionsCompleted || 0,
          milestone.condition.totalMissionsCompleted
        )
        total = milestone.condition.totalMissionsCompleted
      } else if (milestone.condition.consecutiveDays) {
        progress = Math.min(
          userProgress.currentStreak || 0,
          milestone.condition.consecutiveDays
        )
        total = milestone.condition.consecutiveDays
      } else if (milestone.condition.minXP) {
        progress = Math.min(userProgress.xp || 0, milestone.condition.minXP)
        total = milestone.condition.minXP
      }

      return {
        ...milestone,
        isEarned,
        earnedAt: (userProgress.milestones || []).find(
          (m) => m.milestoneId === milestone.id
        )?.earnedAt,
        progress,
        total,
        percentage: Math.floor((progress / total) * 100)
      }
    })
  }, [userProgress])

  // Get progress metrics
  const getProgressMetrics = useCallback(() => {
    const currentLevel = getCurrentLevel()
    const allMissions = getAllMissionsInfo()
    const totalAvailable = allMissions.reduce(
      (sum, level) => sum + level.available.length,
      0
    )
    const totalLocked = allMissions.reduce(
      (sum, level) => sum + level.locked.length,
      0
    )

    return {
      currentLevel,
      currentLevelDetails: levelDetails[currentLevel],
      xp: userProgress.xp || 0,
      totalMissionsCompleted: (userProgress.completedMissions || []).length,
      totalMissionsAvailable: totalAvailable,
      totalMissionsLocked: totalLocked,
      currentStreak: userProgress.currentStreak || 0,
      longestStreak: userProgress.longestStreak || 0,
      totalWorkouts: userProgress.totalWorkouts || 0,
      badgesEarned: (userProgress.skillBadges || []).length,
      milestonesEarned: (userProgress.milestones || []).length
    }
  }, [userProgress, getCurrentLevel, getAllMissionsInfo])

  return {
    // State
    loading,
    error,
    completionData,

    // Data retrieval
    getCurrentLevel,
    getAvailableMissions,
    getLockedMissions,
    getAllMissionsInfo,
    getMissionPrerequisites,
    getBadgesStatus,
    getMilestonesStatus,
    getProgressMetrics,

    // Actions
    completeMission
  }
}

export default useMissions
