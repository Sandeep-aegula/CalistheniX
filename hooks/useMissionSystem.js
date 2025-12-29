import { useState, useEffect } from 'react'
import { allMissions, skillBadges, milestoneAchievements } from '@/data/missionsSystem'

export function useMissionSystem(userId) {
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/missions/progress?userId=${userId}`)
        if (!response.ok) throw new Error('Failed to fetch progress')
        const data = await response.json()
        setUserProgress(data.progress)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchProgress()
    }
  }, [userId])

  // Complete a mission
  const completeMission = async (missionId) => {
    try {
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, missionId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to complete mission')
      }

      const data = await response.json()
      
      // Refresh progress
      const progressResponse = await fetch(`/api/missions/progress?userId=${userId}`)
      const progressData = await progressResponse.json()
      setUserProgress(progressData.progress)

      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Get available missions for current level
  const getAvailableMissions = () => {
    if (!userProgress) return []
    
    return allMissions.filter(mission => {
      // Check if mission prerequisites are met
      if (mission.prerequisites && mission.prerequisites.length > 0) {
        return mission.prerequisites.every(prereq => {
          const completed = userProgress.completedMissions.find(
            c => c.missionId === prereq.missionId
          )
          return completed && completed.completionCount >= prereq.minCompletions
        })
      }
      return true
    })
  }

  // Get locked missions with reasons
  const getLockedMissions = () => {
    if (!userProgress) return []
    
    return allMissions.filter(mission => {
      if (!mission.prerequisites || mission.prerequisites.length === 0) {
        return false
      }
      
      return !mission.prerequisites.every(prereq => {
        const completed = userProgress.completedMissions.find(
          c => c.missionId === prereq.missionId
        )
        return completed && completed.completionCount >= prereq.minCompletions
      })
    })
  }

  // Get missions by level
  const getMissionsByLevel = (level) => {
    return allMissions.filter(m => m.level === level)
  }

  // Check if user has skill badge
  const hasSkillBadge = (badgeId) => {
    return userProgress?.unlockedSkillBadges?.some(b => b.badgeId === badgeId) || false
  }

  // Check if user has milestone
  const hasMilestone = (milestoneId) => {
    return userProgress?.unlockedMilestones?.some(m => m.milestoneId === milestoneId) || false
  }

  // Get user's current tier
  const getCurrentTier = () => {
    if (!userProgress) return null
    
    for (const milestone of [...milestoneAchievements].reverse()) {
      if (userProgress.unlockedMilestones?.some(m => m.milestoneId === milestone.id)) {
        return milestone
      }
    }
    return null
  }

  // Get progress towards next milestone
  const getNextMilestoneProgress = () => {
    if (!userProgress) return null

    for (const milestone of milestoneAchievements) {
      if (userProgress.unlockedMilestones?.some(m => m.milestoneId === milestone.id)) {
        continue
      }

      const requirements = milestone.requirements
      const progress = {
        milestone,
        requirements: {},
        percentComplete: 0
      }

      let totalPercentage = 0
      let requirementCount = 0

      if (requirements.totalWorkouts) {
        const percent = (userProgress.completedMissions?.length || 0) / requirements.totalWorkouts
        progress.requirements.totalWorkouts = {
          current: userProgress.completedMissions?.length || 0,
          required: requirements.totalWorkouts,
          percent: Math.min(100, percent * 100)
        }
        totalPercentage += Math.min(100, percent * 100)
        requirementCount++
      }

      if (requirements.xp) {
        const percent = (userProgress.totalXP || 0) / requirements.xp
        progress.requirements.xp = {
          current: userProgress.totalXP || 0,
          required: requirements.xp,
          percent: Math.min(100, percent * 100)
        }
        totalPercentage += Math.min(100, percent * 100)
        requirementCount++
      }

      if (requirements.consecutiveDays) {
        const percent = (userProgress.currentStreak || 0) / requirements.consecutiveDays
        progress.requirements.consecutiveDays = {
          current: userProgress.currentStreak || 0,
          required: requirements.consecutiveDays,
          percent: Math.min(100, percent * 100)
        }
        totalPercentage += Math.min(100, percent * 100)
        requirementCount++
      }

      if (requirements.skillBadges) {
        const percent = (userProgress.unlockedSkillBadges?.length || 0) / requirements.skillBadges
        progress.requirements.skillBadges = {
          current: userProgress.unlockedSkillBadges?.length || 0,
          required: requirements.skillBadges,
          percent: Math.min(100, percent * 100)
        }
        totalPercentage += Math.min(100, percent * 100)
        requirementCount++
      }

      if (requirementCount > 0) {
        progress.percentComplete = totalPercentage / requirementCount
      }

      return progress
    }

    return null
  }

  return {
    userProgress,
    loading,
    error,
    completeMission,
    getAvailableMissions,
    getLockedMissions,
    getMissionsByLevel,
    hasSkillBadge,
    hasMilestone,
    getCurrentTier,
    getNextMilestoneProgress
  }
}
