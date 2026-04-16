'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  Target, 
  Trophy, 
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  LogIn,
  Activity,
  Lock
} from 'lucide-react'

import Navigation from '@/components/Navigation'
import UserProfile from '@/components/UserProfile'
import SkillCard from '@/components/SkillCard'
import MissionCard from '@/components/MissionCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

import { initialSkills, initialMissions, initialBadges } from '@/data/gameData'

// Mission availability utilities
const getMissionKey = (mission, date = new Date()) => {
  // Temporarily using simple mission ID for debugging
  return `mission_${mission.id}_debug`
  
  /* Original time-based logic - temporarily disabled for debugging
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  switch (mission.type) {
    case 'daily':
      return `daily_${mission.id}_${year}_${month}_${day}`
    case 'weekly':
      const weekNumber = getWeekNumber(date)
      return `weekly_${mission.id}_${year}_${weekNumber}`
    case 'monthly':
      return `monthly_${mission.id}_${year}_${month}`
    default:
      return `mission_${mission.id}`
  }
  */
}

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

const getAvailableMissions = (missions, date = new Date()) => {
  const savedCompletedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]')
  
  return missions.filter(mission => {
    const missionKey = getMissionKey(mission, date)
    
    // Allow all missions of current time period that haven't been completed
    const isAlreadyCompleted = savedCompletedMissions.includes(missionKey)
    
    // For daily missions: show all daily missions for today that aren't completed
    // For weekly missions: show all weekly missions for this week that aren't completed  
    // For monthly missions: show all monthly missions for this month that aren't completed
    return !isAlreadyCompleted
  })
}

const getAvailableMissionsByType = (missions, type, date = new Date()) => {
  const savedCompletedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]')
  
  return missions
    .filter(m => m.type === type)
    .filter(mission => {
      const missionKey = getMissionKey(mission, date)
      return !savedCompletedMissions.includes(missionKey)
    })
}

const getCurrentMissionForType = (missions, type, date = new Date()) => {
  const availableMissions = getAvailableMissionsByType(missions, type, date)
  if (availableMissions.length === 0) return null
  
  // Return first available mission for display
  return availableMissions[0]
}

// Achievement System Definitions
const BADGES = [
  { id: 'first_mission', title: 'Operative Active', desc: 'Secure your first mission completion.', req: (s) => s.missionsCompleted >= 1, icon: 'Zap', color: 'text-primary' },
  { id: 'skill_novice', title: 'Bronze Basics', desc: 'Master 5 different training sub-routines.', req: (s) => s.skillsCompleted >= 5, icon: 'Shield', color: 'text-bronze' },
  { id: 'xp_1000', title: 'Power Surge', desc: 'Amass 1,000 telemetry XP points.', req: (s) => s.totalXP >= 1000, icon: 'Flame', color: 'text-orange-500' },
  { id: 'streak_3', title: 'Heat Signature', desc: 'Maintain active telemetry for 3 consecutive days.', req: (s) => s.currentStreak >= 3, icon: 'Activity', color: 'text-red-500' },
  { id: 'elite_warrior', title: 'Elite Status', desc: 'Complete 25 missions and reach Level 10.', req: (s) => s.missionsCompleted >= 25 && s.level >= 10, icon: 'Trophy', color: 'text-gold' }
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Redirect to landing if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])
  
  // Skills and progress state
  const [skills, setSkills] = useState([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [skillProgress, setSkillProgress] = useState({})
  const [completedSkills, setCompletedSkills] = useState([])
  
  // Mission state  
  const [userMissions, setUserMissions] = useState(initialMissions)
  const [activeMission, setActiveMission] = useState(null) // Only one active mission at a time
  const [completedMissions, setCompletedMissions] = useState([])
  const [showMissionSelection, setShowMissionSelection] = useState(false)
  const [availableMissions, setAvailableMissions] = useState([])
  const [missionSpecificSkills, setMissionSpecificSkills] = useState({})
  
  // Progress tracking state
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    missionLevel: 'beginner',
    skillsCompleted: 0,
    missionsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    unlockedBadges: []
  })
  
  const [progressHistory, setProgressHistory] = useState({
    skillHistory: [], // [{skillName, xp, timestamp, mission}]
    missionHistory: [], // [{missionTitle, xp, timestamp, skills}]
    xpHistory: [], // [{date, xp, total}]
    streakHistory: [] // [{date, streak}]
  })
  
  // Load progress from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    const savedHistory = localStorage.getItem('progressHistory')
    
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats))
      } catch (e) {
        console.error('Error loading user stats:', e)
      }
    }
    
    if (savedHistory) {
      try {
        setProgressHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Error loading progress history:', e)
      }
    }
    
    // Load available missions for current date
    const todaysMissions = getAvailableMissions(initialMissions)
    setAvailableMissions(todaysMissions)
    console.log('Available missions for today:', todaysMissions.map(m => `${m.title} (${m.type})`).join(', '))
  }, [])
  
  // Temporary fix: Check if we should restore Grip Master mission from URL or localStorage
  useEffect(() => {
    // Check if there's a mission in localStorage or URL params
    const savedMission = localStorage.getItem('activeMission')
    const urlParams = new URLSearchParams(window.location.search)
    const missionFromUrl = urlParams.get('mission')
    
    console.log('🔄 Checking for saved mission:', { savedMission, missionFromUrl })
    
    if (savedMission && !activeMission) {
      try {
        const mission = JSON.parse(savedMission)
        console.log('🔄 Restoring mission from localStorage:', mission.title)
        setActiveMission(mission)
      } catch (e) {
        console.error('Error parsing saved mission:', e)
        localStorage.removeItem('activeMission')
      }
    } else if (missionFromUrl && !activeMission) {
      // Find mission by title
      const mission = initialMissions.find(m => m.title.toLowerCase() === missionFromUrl.toLowerCase())
      if (mission) {
        console.log('🔄 Setting mission from URL:', mission.title)
        setActiveMission(mission)
      }
    }
    
    // TEMPORARY DEBUG: If we see Grip Master in the UI but not in state, force set it
    if (!activeMission && window.location.pathname.includes('dashboard')) {
      const gripMasterMission = initialMissions.find(m => m.title === 'Grip Master')
      if (gripMasterMission) {
        console.log('🔧 DEBUG: Force setting Grip Master mission')
        setActiveMission(gripMasterMission)
        localStorage.setItem('activeMission', JSON.stringify(gripMasterMission))
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Workout state
  const [activeWorkouts, setActiveWorkouts] = useState({})

  // Load skills from database on component mount
  useEffect(() => {
    console.log('🔄 Skills useEffect running, session:', !!session)
    const loadSkills = async () => {
      try {
        setLoadingSkills(true)
        console.log('📡 Fetching skills from API...')
        const response = await fetch('/api/skills')
        
        if (response.ok) {
          const data = await response.json()
          console.log('Skills API response:', data)
          
          // Use API skills or fallback to initial skills if empty
          const skillsToUse = data.skills && data.skills.length > 0 ? data.skills : initialSkills
          setSkills(skillsToUse)
          
          // Extract completed skills from user progress
          const completed = skillsToUse
            .filter(skill => skill.isUnlocked && skill.userProgress?.masteryLevel > 0)
            .map(skill => skill.name)
          setCompletedSkills(completed)
          
          console.log('Skills loaded:', skillsToUse.length, 'completed:', completed.length)
        } else if (response.status === 404 || response.status === 500) {
          // If no skills exist, seed the database
          console.log('No skills found, seeding database...')
          const seedResponse = await fetch('/api/seed', { method: 'POST' })
          if (seedResponse.ok) {
            // Retry loading skills after seeding
            const retryResponse = await fetch('/api/skills')
            if (retryResponse.ok) {
              const data = await retryResponse.json()
              const skillsToUse = data.skills && data.skills.length > 0 ? data.skills : initialSkills
              setSkills(skillsToUse)
            } else {
              // If retry fails, use initial skills
              console.log('Retry failed, using initial skills')
              setSkills(initialSkills)
            }
          } else {
            // If seeding fails, use initial skills
            console.log('Seeding failed, using initial skills')
            setSkills(initialSkills)
          }
        }
      } catch (error) {
        console.error('Error loading skills:', error)
        // Fall back to hardcoded skills if API fails
        setSkills(initialSkills)
      } finally {
        setLoadingSkills(false)
      }
    }

    if (session) {
      loadSkills()
    }
  }, [session])
  
  // Real user data from tracked progress
  const currentUser = session ? {
    ...session.user,
    xp: userStats.totalXP,
    level: userStats.level,
    missionLevel: userStats.missionLevel || 'beginner', // Add mission level
    totalWorkouts: userStats.totalWorkouts,
    currentStreak: userStats.currentStreak,
    longestStreak: userStats.longestStreak,
    skillsCompleted: userStats.skillsCompleted,
    missionsCompleted: userStats.missionsCompleted,
    unlockedSkills: completedSkills.map((skillName, index) => ({
      skillId: index + 1,
      skillName: skillName,
      masteryLevel: 1,
      bestPerformance: skillProgress[skillName] || { reps: 0 }
    })),
    badges: [
      // Add dynamic badges based on achievements
      ...(userStats.skillsCompleted >= 1 ? [{ badgeId: 'first-skill', name: 'First Steps', earnedAt: progressHistory.skillHistory[0]?.timestamp }] : []),
      ...(userStats.missionsCompleted >= 1 ? [{ badgeId: 'first-mission', name: 'Mission Master', earnedAt: progressHistory.missionHistory[0]?.timestamp }] : []),
      ...(userStats.level >= 5 ? [{ badgeId: 'level-5', name: 'Rising Star', earnedAt: new Date() }] : []),
      ...(userStats.currentStreak >= 7 ? [{ badgeId: 'streak-7', name: 'Week Warrior', earnedAt: new Date() }] : [])
    ]
  } : null

  // Function to update user progress and history
  const updateUserProgress = (skill, xpEarned, currentMission = null) => {
    const now = new Date()
    
    // Update user stats
    setUserStats(prev => {
      const newTotalXP = prev.totalXP + xpEarned
      const newLevel = Math.floor(newTotalXP / 100) + 1 // Every 100 XP = 1 level
      const newStats = {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        skillsCompleted: prev.skillsCompleted + 1,
        totalWorkouts: prev.totalWorkouts + 1,
        currentStreak: prev.currentStreak + 1, // Simplified streak logic
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1)
      }
      
      // Save to localStorage
      localStorage.setItem('userStats', JSON.stringify(newStats))
      return newStats
    })
    
    // Update progress history
    setProgressHistory(prev => {
      const newHistory = {
        ...prev,
        skillHistory: [
          ...prev.skillHistory,
          {
            skillName: skill.name,
            xp: xpEarned,
            timestamp: now.toISOString(),
            mission: currentMission?.title || null,
            difficulty: skill.difficulty,
            category: skill.category
          }
        ],
        xpHistory: [
          ...prev.xpHistory,
          {
            date: now.toISOString().split('T')[0],
            xp: xpEarned,
            total: (userStats.totalXP + xpEarned),
            source: 'skill',
            details: skill.name
          }
        ]
      }
      
      // Save to localStorage
      localStorage.setItem('progressHistory', JSON.stringify(newHistory))
      return newHistory
    })
    
    console.log(`📊 Progress updated: +${xpEarned} XP for ${skill.name}`)
  }

  const handleStartMission = (mission) => {
    console.log('🎯 handleStartMission called with:', mission.title)
    
    // Only allow one active mission at a time
    if (activeMission) {
      alert(`❌ You already have an active mission: "${activeMission.title}"\n\nComplete or cancel it first before starting a new one.`)
      return
    }
    
    // Create baselines for mission requirements to track fresh progress
    const missionWithBaselines = {
      ...mission,
      baselines: {}
    }
    
    mission.requirements.forEach(req => {
      missionWithBaselines.baselines[req.skillName] = skillProgress[req.skillName]?.totalReps || 0
    })
    
    console.log('🎯 Setting active mission with baselines:', mission.title, missionWithBaselines.baselines)
    setActiveMission(missionWithBaselines)
    
    // Save to localStorage for persistence
    localStorage.setItem('activeMission', JSON.stringify(missionWithBaselines))
    console.log(`Mission "${mission.title}" started!`)
    
    // Auto-redirect to skills page
    setCurrentPage('skills')
    
    alert(`🎯 Mission "${mission.title}" started!\n\n🚀 Redirecting to the Skill Tree to begin your training protocols.\n\n✅ Complete the required skills:\n${mission.requirements.map(req => `• ${req.skillName} - ${req.targetValue} ${req.unit === 'reps' ? 'Reps' : 'Sec'} x 3 Sets`).join('\n')}\n✅ Come back when done to complete the mission`)
  }

  const handleCompleteSkill = async (skill) => {
    console.log('🎯 handleCompleteSkill called with:', skill.name)
    console.log('🎯 Current completedSkills:', completedSkills)
    console.log('🎯 Session status:', !!session)
    
    // Check if user is signed in
    if (!session) {
      alert('❌ You need to be signed in to complete skills!')
      return
    }
    
    // Check if skill is already completed, BUT allow re-completion if it's required for an active mission
    const baseline = activeMission?.baselines?.[skill.name] || 0
    const absoluteTotal = skillProgress[skill.name]?.totalReps || 0
    const missionRequirement = activeMission?.requirements?.find(req => req.skillName === skill.name)
    const missionDone = missionRequirement && (absoluteTotal - baseline) >= missionRequirement.targetValue

    if (completedSkills.includes(skill.name) && !activeMission) {
      console.log('Skill already completed globally')
      alert(`✅ You've already mastered ${skill.name}!`)
      return
    }
    
    if (activeMission && missionDone) {
      console.log('Skill already completed for this mission')
      alert(`✅ You've already completed the ${skill.name} requirement for this protocol!`)
      return
    }
    
    try {
      console.log('Saving skill completion to database')
      
      // Get target reps for this skill (from mission or default)
      const targetReps = activeMission?.requirements.find(req => req.skillName === skill.name)?.targetValue || skill.targetReps || 10
      
      console.log('Request payload:', {
        skillId: skill.id || skill._id,
        skillName: skill.name,
        skillObject: skill,
        performance: {
          reps: targetReps,
          sets: skill.targetSets || 1,
          duration: 0
        }
      })
      
      // Call the skills API to save progress to database
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId: skill.id || skill._id, // Handle both formats
          skillName: skill.name,
          performance: {
            reps: targetReps,
            sets: skill.targetSets || 1,
            duration: 0
          }
        }),
      })
      
      console.log('API Response status:', response.status)
      
      // Handle non-200 responses
      if (!response.ok) {
        console.error('❌ API request failed with status:', response.status)
        
        let errorData = {}
        try {
          errorData = await response.json()
        } catch (e) {
          console.log('Could not parse error response as JSON')
        }
        
        console.error('API Error details:', errorData)
        
        // ALWAYS use fallback completion for demo purposes
        console.log('⚠️ Using fallback local completion (API failed)')
        
        // Try to seed the database if skill not found
        if (response.status === 404) {
          console.log('🌱 Attempting to seed database...')
          try {
            const seedResponse = await fetch('/api/seed', { method: 'POST' })
            if (seedResponse.ok) {
              console.log('✅ Database seeded successfully')
            }
          } catch (seedError) {
            console.error('❌ Failed to seed database:', seedError)
          }
        }
        
        // Update local state - this always works regardless of API
        if (!completedSkills.includes(skill.name)) {
          setCompletedSkills(prev => [...prev, skill.name])
        }
        
        setSkillProgress(prev => ({
          ...prev,
          [skill.name]: {
            ...prev[skill.name],
            totalReps: (prev[skill.name]?.totalReps || 0) + targetReps,
            lastWorkout: new Date(),
            completedSessions: (prev[skill.name]?.completedSessions || 0) + 1,
            bestSingleSession: Math.max(prev[skill.name]?.bestSingleSession || 0, targetReps)
          }
        }))
        
        // Update XP and stats properly
        const xpEarned = skill.xpReward || 15
        updateUserProgress(skill, xpEarned, activeMission)
        
        const reasonMap = {
          401: 'Not authenticated',
          404: 'Skill not found in database (seeded for next time)',
          500: 'Server error'
        }
        const reasonMsg = reasonMap[response.status] || errorData.error || `API Error ${response.status}`
        
        alert(`🎉 ${skill.name} completed!\n\n⚠️ Note: Local completion only\n📝 Reason: ${reasonMsg}\n🎯 XP Earned: +${xpEarned}${activeMission ? '\n💪 Check your mission progress!' : ''}`)
        return // Important: return here, don't throw
      }
      
      const result = await response.json()
      console.log('Skill progress saved:', result)
      
      // Update local state after successful database save
      if (!completedSkills.includes(skill.name)) {
        setCompletedSkills(prev => [...prev, skill.name])
      }
      
      setSkillProgress(prev => ({
        ...prev,
        [skill.name]: {
          ...prev[skill.name],
          totalReps: (prev[skill.name]?.totalReps || 0) + targetReps,
          lastWorkout: new Date(),
          completedSessions: (prev[skill.name]?.completedSessions || 0) + 1,
          bestSingleSession: Math.max(prev[skill.name]?.bestSingleSession || 0, targetReps)
        }
      }))
      
      // Update XP and stats properly
      const xpEarned = result.xpEarned || skill.xpReward || 15
      updateUserProgress(skill, xpEarned, activeMission)
      
      console.log('Skill completed successfully')
      alert(`🎉 ${skill.name} completed!\n\n✅ Skill progress saved to database!\n🎯 XP Earned: +${xpEarned}${activeMission ? '\n💪 Check your mission progress!' : ''}`)
      
    } catch (error) {
      console.error('❌ Unexpected error completing skill:', error)
      
      // Even if there's an unexpected error, still complete the skill locally
      console.log('🔄 Attempting local completion despite error...')
      
      const targetReps = activeMission?.requirements.find(req => req.skillName === skill.name)?.targetValue || skill.targetReps || 10
      
      // Update local state as fallback
      if (!completedSkills.includes(skill.name)) {
        setCompletedSkills(prev => [...prev, skill.name])
      }
      
      setSkillProgress(prev => ({
        ...prev,
        [skill.name]: {
          ...prev[skill.name],
          totalReps: (prev[skill.name]?.totalReps || 0) + targetReps,
          lastWorkout: new Date(),
          completedSessions: (prev[skill.name]?.completedSessions || 0) + 1,
          bestSingleSession: Math.max(prev[skill.name]?.bestSingleSession || 0, targetReps)
        }
      }))
      
      // Update XP and stats properly
      const xpEarned = skill.xpReward || 15
      updateUserProgress(skill, xpEarned, activeMission)
      
      alert(`🎉 ${skill.name} completed!\n\n⚠️ Note: Local completion only\n📝 Reason: ${error.message || 'Unexpected error'}\n🎯 XP Earned: +${xpEarned}${activeMission ? '\n💪 Check your mission progress!' : ''}`)    }
  }

  const handleStartSkill = (skill) => {
    const workoutId = `${skill.name}_${Date.now()}`
    setActiveWorkouts(prev => ({
      ...prev,
      [workoutId]: {
        skillName: skill.name,
        targetReps: skill.targetReps,
        currentReps: 0,
        startTime: new Date(),
        status: 'active'
      }
    }))
    
    // Interactive workout session with clear completion flow
    const targetReps = skill.targetReps || 10
    let currentReps = 0
    
    const showWorkoutStatus = () => {
      const progress = Math.round((currentReps / targetReps) * 100)
      return `🏋️ ${skill.name} Training\n\n📊 Progress: ${currentReps}/${targetReps} reps (${progress}%)\n\n${'█'.repeat(Math.floor(progress/10))}${'░'.repeat(10-Math.floor(progress/10))}`
    }
    
    const workoutMenu = () => {
      if (currentReps >= targetReps) {
        // Target reached - clear completion option
        const choice = confirm(`🎯 TARGET REACHED!\n\n${showWorkoutStatus()}\n\n✅ Click OK to COMPLETE workout\n🔄 Click Cancel to continue training`)
        
        if (choice) {
          completeWorkout()
          return
        }
      }
      
      const action = prompt(`${showWorkoutStatus()}\n\nChoose an option:\n\n1️⃣ Add reps (enter number)\n2️⃣ Complete workout (type 'complete')\n3️⃣ Cancel workout (type 'cancel')`)
      
      if (action === 'cancel' || action === null) {
        const confirmCancel = confirm('❌ Cancel workout?\n\nYour progress will be lost.')
        if (confirmCancel) {
          cancelWorkout()
          return
        } else {
          setTimeout(workoutMenu, 500)
          return
        }
      }
      
      if (action === 'complete' || action === 'done') {
        if (currentReps === 0) {
          alert('❌ You need to do at least 1 rep before completing!')
          setTimeout(workoutMenu, 500)
          return
        }
        completeWorkout()
        return
      }
      
      const repsNum = parseInt(action)
      if (!isNaN(repsNum) && repsNum > 0) {
        currentReps += repsNum
        const isTargetReached = currentReps >= targetReps
        alert(`✅ +${repsNum} reps added!\n\nTotal: ${currentReps}/${targetReps} reps\n\n${isTargetReached ? '🎯 TARGET REACHED! 🎉' : '💪 Keep going!'}`)
        
        setTimeout(workoutMenu, 1000)
      } else {
        alert('❌ Invalid input!\n\nPlease enter:\n• A number (e.g., "5")\n• "complete" to finish\n• "cancel" to quit')
        setTimeout(workoutMenu, 500)
      }
    }
    
    const completeWorkout = () => {
      const totalReps = currentReps
      const skillKey = skill.name
      
      setSkillProgress(prev => ({
        ...prev,
        [skillKey]: {
          ...prev[skillKey],
          totalReps: (prev[skillKey]?.totalReps || 0) + totalReps,
          lastWorkout: new Date(),
          completedSessions: (prev[skillKey]?.completedSessions || 0) + 1,
          bestSingleSession: Math.max(prev[skillKey]?.bestSingleSession || 0, totalReps)
        }
      }))
      
      // Remove from active workouts
      setActiveWorkouts(prev => {
        const updated = { ...prev }
        delete updated[workoutId]
        return updated
      })
      
      // Success message with stats
      const newTotal = (skillProgress[skillKey]?.totalReps || 0) + totalReps
      alert(`🎉 WORKOUT COMPLETED! 🎉\n\n💪 ${skill.name}: ${totalReps} reps this session\n📈 Total lifetime reps: ${newTotal}\n🏆 Sessions completed: ${(skillProgress[skillKey]?.completedSessions || 0) + 1}\n\n🎯 Go check your Mission progress!`)
      
      // Check if this workout completion satisfies mission requirements
      if (activeMission) {
        const requirement = activeMission.requirements.find(req => req.skillName === skill.name)
        if (requirement && newTotal >= requirement.targetValue) {
          // Mark this skill as completed for the mission
          setCompletedSkills(prev => {
            if (!prev.includes(skill.name)) {
              return [...prev, skill.name]
            }
            return prev
          })
          
          // Check if all mission requirements are now met
          const allRequirementsMet = activeMission.requirements.every(req => {
            if (req.skillName === skill.name) {
              return newTotal >= req.targetValue
            }
            const otherSkillProgress = skillProgress[req.skillName]
            return otherSkillProgress && otherSkillProgress.totalReps >= req.targetValue
          })
          
          if (allRequirementsMet) {
            setTimeout(() => {
              alert(`🎯 MISSION READY TO COMPLETE! 🎯\n\nAll requirements for "${activeMission.title}" are now met!\n\n✅ Go to the Missions section to claim your reward!`)
            }, 2000)
          }
        }
      }
    }
    
    const cancelWorkout = () => {
      setActiveWorkouts(prev => {
        const updated = { ...prev }
        delete updated[workoutId]
        return updated
      })
      alert('❌ Workout cancelled')
    }
    
    // Start the workout with clear instructions
    alert(`🚀 Starting ${skill.name} Training!\n\n🎯 Target: ${targetReps} reps\n💡 How it works:\n• Do your exercise\n• Enter reps as you complete them\n• Type "complete" when done\n\nReady? Let's begin! 💪`)
    setTimeout(workoutMenu, 2000)
  }

  const handleCompleteMission = async (mission) => {
    try {
      if (!activeMission || activeMission.title !== mission.title) {
        alert('❌ This mission is not currently active!')
        return
      }
      
      // Check if mission requirements are met
      const requirementsMet = mission.requirements.every(req => {
        // Check if skill is completed (in completedSkills array) for simple check
        // Or check skillProgress for detailed reps tracking
        const isSkillCompleted = completedSkills.includes(req.skillName)
        const skillProgressForSkill = skillProgress[req.skillName]
        const hasEnoughReps = skillProgressForSkill && skillProgressForSkill.totalReps >= req.targetValue
        
        return isSkillCompleted || hasEnoughReps
      })
      
      if (!requirementsMet) {
        const uncompletedSkills = mission.requirements.filter(req => {
          const isSkillCompleted = completedSkills.includes(req.skillName)
          const skillProgressForSkill = skillProgress[req.skillName]
          const hasEnoughReps = skillProgressForSkill && skillProgressForSkill.totalReps >= req.targetValue
          return !isSkillCompleted && !hasEnoughReps
        })
        
        alert(`❌ Mission requirements not met!\n\nYou still need to complete:\n${
          uncompletedSkills
            .map(req => {
              const currentReps = skillProgress[req.skillName]?.totalReps || 0
              const isCompleted = completedSkills.includes(req.skillName) ? ' ✅' : ''
              return `• ${req.skillName}: ${currentReps}/${req.targetValue} ${req.unit}${isCompleted}`
            })
            .join('\n')
        }\n\nGo to Skills page and complete more skills!`)
        return
      }
      
      // Call the real API to complete the mission
      console.log('🚀 Calling mission completion API...')
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          missionId: mission.id,
          userId: session?.user?.id || 'demo-user'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`❌ Failed to complete mission: ${errorData.error || 'Unknown error'}`)
        return
      }

      const result = await response.json()
      console.log('✅ Mission completed via API:', result)

      // Update user stats and check achievements
      if (result.user) {
        setUserStats(prev => {
          const updatedStats = {
            ...prev,
            totalXP: result.user.xp,
            level: result.user.level,
            missionLevel: result.user.missionLevel,
            currentStreak: result.user.currentStreak,
            longestStreak: result.user.longestStreak,
            totalWorkouts: result.user.totalWorkouts,
            missionsCompleted: prev.missionsCompleted + 1
          }
          
          // Check for new badge unlocks based on these updated stats
          const newlyUnlocked = BADGES.filter(badge => 
            badge.req(updatedStats) && !prev.unlockedBadges?.includes(badge.id)
          )
          
          const finalStats = {
            ...updatedStats,
            unlockedBadges: [
              ...(prev.unlockedBadges || []),
              ...newlyUnlocked.map(b => b.id)
            ]
          }
          
          if (newlyUnlocked.length > 0) {
            setTimeout(() => {
              alert(`🏆 UNLOCKED: ${newlyUnlocked.map(b => b.title).join(', ')}\n\nNew accolades added to the Vault.`)
            }, 3000)
          }
          
          localStorage.setItem('userStats', JSON.stringify(finalStats))
          return finalStats
        })
      }
      
      // Mark mission as completed with time-based key
      const missionKey = getMissionKey(mission)
      console.log('🔍 Mission completion debug:', {
        mission: mission.title,
        missionId: mission.id,
        missionKey: missionKey,
        currentDate: new Date().toISOString()
      })
      
      // Update localStorage with completed mission FIRST
      const savedCompletedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]')
      const updatedCompletedMissions = [...savedCompletedMissions, missionKey]
      localStorage.setItem('completedMissions', JSON.stringify(updatedCompletedMissions))
      console.log('🔍 Updated completed missions in localStorage:', updatedCompletedMissions)
      
      // Update state
      setCompletedMissions(prev => [...prev, missionKey])
      setActiveMission(null) // Clear active mission
      localStorage.removeItem('activeMission')
      
      // Now get remaining available missions (this should exclude the just-completed mission)
      const remainingMissions = getAvailableMissions(initialMissions)
      console.log('🔍 Remaining missions after completion:', remainingMissions.map(m => `${m.title} (${m.id})`))
      setAvailableMissions(remainingMissions)
      
      console.log('🔍 After mission completion:', {
        completedMission: mission.title,
        missionKey,
        remainingMissionsCount: remainingMissions.length,
        remainingMissions: remainingMissions.map(m => m.title),
        willShowSelection: remainingMissions.length > 0
      })
      
      // Show mission selection ONLY if there are remaining missions
      if (remainingMissions.length > 0) {
        console.log('✅ More missions available - showing success and redirecting')
        
        // Switch to missions page first
        setCurrentPage('missions')
        
        // Show success notification with next mission hint
        setTimeout(() => {
          const newLevel = result.user?.level || userStats.level
          const earnedXP = result.rewards?.xpEarned || missionXP
          alert(`🎉 Mission "${mission.title}" completed!\n\n✅ +${earnedXP} XP earned!\n✅ Skills trained: ${mission.requirements.map(req => `${req.skillName} - ${req.targetValue} ${req.unit === 'reps' ? 'Reps' : 'Sec'} x 3 Sets`).join(', ')}\n🏆 Level ${newLevel}!\n\n🚀 ${remainingMissions.length} more missions available!\nChoose your next mission to keep the momentum going!`)
          
          // Show mission selection dialog after user acknowledges
          setTimeout(() => {
            setShowMissionSelection(true)
          }, 500)
        }, 1000)
        
      } else {
        console.log('❌ No available missions, showing completion message')
        // No more missions available today
        setTimeout(() => {
          alert('🎉 Excellent work! You\'ve completed all available missions for this period!\n\n⏰ New missions will be available:\n• Daily missions: Tomorrow\n• Weekly missions: Next week\n• Monthly missions: Next month\n\n🏆 Take a well-deserved rest!')
        }, 1000)
      }
      
      // Update mission progress and history
      const missionXP = result.rewards?.xpEarned || mission.xpReward || 50
      const now = new Date()
      
      // Update progress history
      setProgressHistory(prev => {
        const newHistory = {
          ...prev,
          missionHistory: [
            ...(prev.missionHistory || []),
            {
              missionTitle: mission.title,
              missionId: mission.id,
              xp: missionXP,
              timestamp: now.toISOString(),
              skills: mission.requirements.map(req => req.skillName),
              difficulty: mission.category || 'Standard',
              type: mission.type
            }
          ],
          xpHistory: [
            ...(prev.xpHistory || []),
            {
              date: now.toISOString(),
              xp: missionXP,
              activity: `Protocol Completed: ${mission.title}`
            }
          ]
        }
        localStorage.setItem('progressHistory', JSON.stringify(newHistory))
        return newHistory
      })

      console.log(`Mission "${mission.title}" completed! +${missionXP} XP`)
      
    } catch (error) {
      console.error('Failed to complete mission:', error)
      alert('Failed to complete mission. Please try again.')
    }
  }
  
  const handleStartMissionFromSelection = (mission) => {
    // Only allow mission selection from Mission section
    if (currentPage !== 'missions') {
      console.log('❌ Mission selection only allowed from Mission section')
      alert('⚠️ Please go to Mission Center to select missions!')
      return
    }
    
    // Check if mission is in available missions list
    if (!availableMissions.some(m => m.id === mission.id)) {
      console.log('❌ Mission not available:', mission.title)
      alert('⚠️ This mission is not currently available!')
      return
    }
    
    setActiveMission(mission)
    localStorage.setItem('activeMission', JSON.stringify(mission))
    
    // Initialize mission-specific skill tracking
    const missionId = mission.id
    setMissionSpecificSkills(prev => ({
      ...prev,
      [missionId]: [] // Start with empty array for this mission
    }))
    
    setShowMissionSelection(false)
    
    // Auto-redirect to skills page
    setCurrentPage('skills')
    
    console.log(`Started new mission: ${mission.title} (from Mission Center)`)
    alert(`🚀 New Mission Started!\n\n🎯 Mission: ${mission.title}\n📝 ${mission.description}\n\n✅ Redirecting to Skill Tree to complete requirements:\n${mission.requirements.map(req => `• ${req.skillName} - ${req.targetValue} ${req.unit === 'reps' ? 'Reps' : 'Sec'} x 3 Sets`).join('\n')}\n\nGood luck, warrior!`)
  }
  
  const handleSkipMissionSelection = () => {
    // Only allow from Mission section
    if (currentPage !== 'missions') {
      console.log('❌ Skip mission selection only allowed from Mission section')
      return
    }
    
    setShowMissionSelection(false)
    alert('🛤️ Taking a break from missions!\n\nYou can start a new mission anytime from the Mission Center.')
  }

  const handleCancelMission = () => {
    if (!activeMission) return
    
    const confirmed = confirm(`⚠️ Cancel active mission "${activeMission.title}"?\n\nAll progress will be lost.`)
    
    if (confirmed) {
      setActiveMission(null)
      localStorage.removeItem('activeMission')
      setCompletedSkills([])
      // Reset skill progress for cancelled mission
      const resetProgress = { ...skillProgress }
      activeMission.requirements.forEach(req => {
        if (resetProgress[req.skillName]) {
          resetProgress[req.skillName] = {
            ...resetProgress[req.skillName],
            totalReps: 0
          }
        }
      })
      setSkillProgress(resetProgress)
      alert('🚫 Mission cancelled')
    }
  }

  const renderDashboard = () => (
    <div className="space-y-12 pb-24">
      {/* Header with Telemetry feel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-bronze font-black text-[10px] tracking-[0.4em] uppercase mb-2"
          >
            <Activity className="w-3 h-3" /> Live Operations
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Training <span className="text-bronze">Terminal</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-4 bg-iron/5 p-2 rounded-2xl glass-panel border border-gray-200">
          <div className="px-4 py-2 text-center border-r border-gray-300">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Efficiency</div>
            <div className="text-lg font-black text-primary">94%</div>
          </div>
          <div className="px-4 py-2 text-center">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Division</div>
            <div className="text-lg font-black text-bronze italic">ELITE</div>
          </div>
        </div>
      </div>

      {!session && (
        <Card variant="iron" className="p-16 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Zap className="w-48 h-48 text-primary" />
          </div>
          <div className="relative z-10 space-y-8 max-w-xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
              Identity <span className="text-primary">Required</span>
            </h3>
            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">
              Initialize a session to track telemetry, unlock progression logic, and access mission profiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cyber" size="xl" onClick={() => signIn('google')}>
                Authenticate
              </Button>
            </div>
          </div>
        </Card>
      )}

      {session && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Active Mission & Profile */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Mission Hero */}
            {activeMission ? (
              <Card variant="iron" className="p-0 border-none overflow-hidden relative group" animate>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-48 h-48 text-primary" />
                </div>
                
                <div className="p-10 md:p-12 relative z-10">
                  <div className="flex items-center gap-3 text-bronze mb-6 font-black text-xs tracking-[0.3em] uppercase">
                    <Target className="w-5 h-5" /> Mission Active
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
                    {activeMission.title}
                  </h3>
                  
                  <p className="text-white/60 max-w-xl text-lg mb-10 font-medium tracking-tight">
                    {activeMission.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {activeMission.requirements.map((req, i) => {
                      const absoluteTotal = skillProgress[req.skillName]?.totalReps || 0
                      const baseline = activeMission.baselines?.[req.skillName] || 0
                      const current = Math.max(0, absoluteTotal - baseline)
                      
                      const progressRaw = (current / (req.targetValue || 10)) * 100
                      const progress = isNaN(progressRaw) ? 0 : Math.min(progressRaw, 100)
                      const isDone = current >= (req.targetValue || 10)
                      
                      return (
                        <div key={i} className="p-5 rounded-xl bg-black/40 border border-white/5">
                          <div className="flex justify-between items-end mb-3">
                            <span className="text-sm font-black text-white lowercase tracking-tight">{req.skillName}</span>
                            <div className="text-right">
                              <div className="text-[9px] font-black text-bronze lowercase tracking-widest mb-1">target: 10 x 3 sets</div>
                              <span className={cn("text-lg font-black", isDone ? "text-primary" : "text-bronze")}>
                                {current}<span className="text-[10px] text-white/40 ml-1">/{req.targetValue}</span>
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className={cn("h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]", isDone ? "bg-primary" : "bg-bronze")}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Button 
                      variant="cyber" 
                      size="lg"
                      className="px-10 font-black italic shadow-2xl"
                      onClick={() => setCurrentPage('skills')}
                    >
                      Execute Program <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        if (confirm('Cancel current mission? Progression for this mission will be archived.')) {
                          setActiveMission(null)
                          localStorage.removeItem('activeMission')
                        }
                      }}
                    >
                      Abort Mission
                    </Button>
                  </div>
                </div>
                
                {/* Bottom Progress Bar for Mission */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
                    <div className="h-full bg-gradient-to-r from-primary to-cyan-400 w-[30%]" />
                </div>
              </Card>
            ) : (
              <Card variant="iron" className="p-16 text-center border-dashed border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Zap className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">No Active Protocol</h3>
                <p className="text-white/40 max-w-md mx-auto mb-10 font-bold lowercase tracking-widest text-xs leading-relaxed">
                  initialize a mission from the central command to begin data collection and physical progression.
                </p>
                <Button 
                  variant="cyber" 
                  size="xl" 
                  onClick={() => setCurrentPage('missions')}
                >
                  Initialize Missions
                </Button>
              </Card>
            )}

            {/* Secondary Layout - Training History/Telemetry */}
            <div className="grid md:grid-cols-2 gap-8">
               <Card variant="glass" className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg transform -rotate-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter italic">Growth <span className="text-primary">Metrics</span></h4>
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: 'weekly intensity', val: '+12%', color: 'text-primary' },
                       { label: 'recovery score', val: '88/100', color: 'text-green-500' },
                       { label: 'skill mastery', val: `${userStats.skillsCompleted}/28`, color: 'text-bronze' },
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-200">
                          <span className="text-[10px] font-black text-muted-foreground lowercase tracking-widest">{item.label}</span>
                          <span className={cn("text-lg font-black tracking-tight", item.color)}>{item.val}</span>
                       </div>
                     ))}
                  </div>
               </Card>

               <Card variant="iron" className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-xl bg-bronze flex items-center justify-center shadow-lg transform rotate-3">
                        <Trophy className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white underline decoration-bronze underline-offset-8">Recent <span className="text-bronze">Vault</span></h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(!userStats.unlockedBadges || userStats.unlockedBadges.length === 0) ? (
                       [1, 2, 3, 4, 5, 6].map(i => (
                         <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-20 grayscale">
                            <Trophy className="w-6 h-6 text-white/5" />
                         </div>
                       ))
                    ) : (
                       userStats.unlockedBadges.slice(-6).reverse().map(badgeId => (
                         <div key={badgeId} className="aspect-square rounded-xl bg-white/10 border border-bronze/30 flex items-center justify-center group hover:bg-bronze/10 transition-all cursor-help" title={BADGES.find(b => b.id === badgeId)?.title}>
                            <Trophy className="w-6 h-6 text-bronze" />
                         </div>
                       ))
                    )}
                  </div>
               </Card>
            </div>
          </div>

          {/* Right Column: Profile & Summary */}
          <div className="lg:col-span-4 space-y-8">
            <UserProfile user={currentUser} showAnimation={true} />
            
            {/* System Diagnostics */}
            <Card variant="glass" className="bg-steel/30 border-gray-300 p-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 text-center">System Diagnostics</h4>
               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black lowercase tracking-widest text-muted-foreground mb-2">
                       <span>bioavailability</span>
                       <span className="text-primary">optimized</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-4/5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black lowercase tracking-widest text-muted-foreground mb-2">
                       <span>neural drive</span>
                       <span className="text-bronze">high</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-bronze w-2/3" />
                    </div>
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-gray-300 flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black lowercase tracking-widest text-muted-foreground">neural link active</span>
               </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )

  // Filter skills based on active mission
  const filteredSkills = activeMission 
    ? skills.filter(skill => 
        activeMission.requirements.some(req => req.skillName === skill.name)
      )
    : [] // Return empty array when no active mission to enforce mission-first flow

  // Auto-complete mission when all required skills are done
  useEffect(() => {
    if (activeMission && completedSkills.length > 0) {
      const requiredSkills = activeMission.requirements.map(req => req.skillName)
      const completedRequiredSkills = requiredSkills.filter(skillName => 
        completedSkills.includes(skillName)
      )
      
      console.log('🎯 Mission Progress Check:', {
        mission: activeMission.title,
        required: requiredSkills,
        completed: completedRequiredSkills,
        isComplete: completedRequiredSkills.length === requiredSkills.length
      })
      
      // Check if all required skills are completed
      if (completedRequiredSkills.length === requiredSkills.length) {
        console.log('🎉 Mission completed automatically!', activeMission.title)
        handleCompleteMission(activeMission)
      }
    }
  }, [completedSkills, activeMission, handleCompleteMission])

  // Debug logging for mission filtering - moved to useEffect to avoid spam
  useEffect(() => {
    console.log('📊 Dashboard Debug State Change:', {
      activeMission: activeMission?.title,
      activeMissionId: activeMission?.id,
      totalSkills: skills.length,
      filteredSkills: filteredSkills.length,
      skillNames: skills.map(s => s.name).slice(0, 5), // First 5 only
      missionRequirements: activeMission?.requirements?.map(r => r.skillName),
      session: !!session,
      loadingSkills
    })
  }, [activeMission, skills.length, session, loadingSkills, filteredSkills.length, skills])

  const renderSkills = () => (
    <motion.div
      className="space-y-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-2">
            {activeMission ? <span className="text-bronze">Active Protocol Component</span> : 'Skill Tree'}
          </h1>
          <p className="text-muted-foreground font-bold lowercase tracking-widest text-xs">
            {activeMission 
              ? `initialize ${activeMission.requirements.length} sub-routines to authorize completion of protocol: ${activeMission.title}` 
              : 'master the fundamentals and unlock advanced physical capabilities'
            }
          </p>
        </div>
        
        {/* Mission Progress Bar */}
        {activeMission && (
          <Card variant="iron" className="p-6 relative overflow-hidden group border-white/10">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Activity className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-white uppercase italic tracking-tighter text-2xl">Mission Progress</h3>
                <span className="text-sm font-black text-primary lowercase tracking-[0.2em]">
                  {activeMission.requirements.filter(req => completedSkills.includes(req.skillName)).length}/{activeMission.requirements.length} skills
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-black/40 rounded-full h-1.5 mb-8 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-cyan-400 rounded-full h-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${isNaN(activeMission.requirements.filter(req => completedSkills.includes(req.skillName)).length / activeMission.requirements.length) ? 0 : (activeMission.requirements.filter(req => completedSkills.includes(req.skillName)).length / activeMission.requirements.length) * 100}%`
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {activeMission.requirements.map((req, idx) => {
                    const absoluteTotal = skillProgress[req.skillName]?.totalReps || 0
                    const baseline = activeMission.baselines?.[req.skillName] || 0
                    const isDone = (absoluteTotal - baseline) >= req.targetValue
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black lowercase tracking-tight flex items-center gap-2 border transition-all",
                          isDone
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-white/5 text-white/50 border-white/10"
                        )}
                      >
                        {isDone ? <Zap className="w-3 h-3 fill-primary" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />} 
                        {req.skillName} - {req.targetValue} {req.unit === 'reps' ? 'Reps' : 'Sec'} x 3 Sets
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-start gap-4 pt-4 border-t border-white/10">
                  <Button 
                    variant="glass" 
                    size="sm"
                    className="font-black lowercase tracking-widest text-[10px]" 
                    onClick={handleCancelMission}
                  >
                    abort protocol
                  </Button>
                  <Button 
                    variant="cyber" 
                    size="sm"
                    className="font-black lowercase tracking-widest text-[10px]"  
                    onClick={() => setCurrentPage('missions')}
                  >
                    return to mission control
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Debug Info */}
        {session && (
          <div className="text-xs text-muted-foreground text-center mb-4">
            Debug: showMissionSelection={showMissionSelection.toString()}, availableMissions={availableMissions.length}
          </div>
        )}
        
        {/* Mission Selection Dialog - Enhanced UX - ONLY in Missions Section */}
        {showMissionSelection && currentPage === 'missions' && availableMissions.length > 0 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background border border-border rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMissionSelection(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
              
              <div className="text-center space-y-4 mb-6">
                <h2 className="text-2xl font-bold gradient-text">🎯 Select Your Next Mission</h2>
                <p className="text-muted-foreground">Congratulations on completing your mission! Choose your next challenge:</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                    💪 {availableMissions.length} Missions Available
                  </div>
                  <div className="bg-secondary/10 px-3 py-1 rounded-full text-secondary">
                    🚀 Keep the momentum going!
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {availableMissions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-all cursor-pointer group"
                    onClick={() => handleStartMissionFromSelection(mission)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-primary group-hover:text-primary/80 transition-colors">{mission.title}</h3>
                      <div className="flex gap-2">
                        <div className={`text-xs px-2 py-1 rounded-full transition-all ${
                          mission.type === 'daily' ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' :
                          mission.type === 'weekly' ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30' :
                          mission.type === 'monthly' ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30' :
                          'bg-secondary/20 text-secondary group-hover:bg-secondary/30'
                        }`}>
                          {mission.type}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {mission.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Required Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {mission.requirements.map((req, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                              {req.skillName} - {req.targetValue} {req.unit === 'reps' ? 'Reps' : 'Sec'} x 3 Sets
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="text-sm font-medium text-secondary">
                          +{mission.xpReward || 50} XP Reward
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {mission.requirements.length} skills required
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMissionSelection(false)}
                  className="mr-2"
                >
                  Maybe Later
                </Button>
                <span className="text-xs text-muted-foreground">Click any mission above to start immediately</span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingSkills ? (
          // Loading placeholder
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <Card.Header>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </Card.Header>
              <Card.Content>
                <div className="h-20 bg-muted rounded"></div>
              </Card.Content>
            </Card>
          ))
        ) : filteredSkills.length === 0 && !activeMission ? (
          // No active mission - guide user to select one
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground space-y-4">
              <Target className="w-16 h-16 mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No Active Mission</h3>
                <p className="text-sm">
                  Start your journey by selecting a mission! Missions guide you through specific skill combinations for focused training.
                </p>
                <div className="mt-4">
                  <Button 
                    variant="primary"
                    onClick={() => setCurrentPage('missions')}
                  >
                    🎯 Choose Your First Mission
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : filteredSkills.length === 0 ? (
          // No skills found message
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground space-y-4">
              <Target className="w-16 h-16 mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {activeMission 
                    ? `No matching skills found for "${activeMission.title}"` 
                    : 'No skills available'
                  }
                </h3>
                <p className="text-sm">
                  {skills.length === 0 
                    ? 'Skills are loading or database needs to be seeded.' 
                    : activeMission 
                      ? 'The mission requirements might not match available skills.' 
                      : 'Check your connection or try refreshing.'
                  }
                </p>
                <div className="mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                  {activeMission && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage('skills')}
                    >
                      View All Skills
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          filteredSkills.map((skill, index) => {
            const isRequiredForActiveMission = activeMission?.requirements.some(req => req.skillName === skill.name)
            const isUnlocked = skill.isUnlocked !== false || index < 10 || isRequiredForActiveMission // Auto-unlock first 10 skills and mission-required skills
            const skillProgressData = skillProgress[skill.name]
            const isCompleted = completedSkills.includes(skill.name)
            
            // Debug logging for each skill
            console.log(`🔍 Skill ${skill.name}:`, {
              isUnlocked,
              isCompleted,
              hasCompleteHandler: !!handleCompleteSkill,
              index
            })
            
            return (
              <SkillCard 
                key={skill._id || skill.name}
                skill={skill}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                userProgress={skillProgressData ? { 
                  bestPerformance: { reps: skillProgressData.totalReps },
                  totalSessions: skillProgressData.completedSessions
                } : null}
                onStartSkill={null} // Remove old start training functionality
                onCompleteSkill={handleCompleteSkill}
                showMissionRequired={!activeMission}
                isRequiredForActiveMission={isRequiredForActiveMission}
              />
            )
          })
        )}
      </div>
    </motion.div>
  )

  const renderMissions = () => (
    <motion.div
      className="space-y-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-2">
          Mission <span className="text-bronze">Control</span>
        </h1>
        <p className="text-muted-foreground font-bold lowercase tracking-widest text-xs">
          select protocols to earn xp and unlock higher physical ranks
        </p>
      </div>

      {/* Mission Period Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <Card variant="iron" className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <Zap className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Daily Protocols</h4>
            <div className="text-4xl font-black italic">{getAvailableMissionsByType(initialMissions, 'daily').length}</div>
            <div className="text-[10px] lowercase font-bold text-muted-foreground tracking-widest">available today</div>
          </div>
        </Card>
        
        <Card variant="iron" className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <Target className="w-24 h-24 text-bronze" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-bronze">Weekly Protocols</h4>
            <div className="text-4xl font-black italic">{getAvailableMissionsByType(initialMissions, 'weekly').length}</div>
            <div className="text-[10px] lowercase font-bold text-muted-foreground tracking-widest">available this week</div>
          </div>
        </Card>
        
        <Card variant="iron" className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <Trophy className="w-24 h-24 text-orange-500" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Monthly Ranks</h4>
            <div className="text-4xl font-black italic">{getAvailableMissionsByType(initialMissions, 'monthly').length}</div>
            <div className="text-[10px] lowercase font-bold text-muted-foreground tracking-widest">available this month</div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {availableMissions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground space-y-4">
              <Trophy className="w-16 h-16 mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">All Missions Completed!</h3>
                <p className="text-sm">
                  Incredible! You&apos;ve completed all available missions for this period.
                </p>
                <p className="text-xs mt-2 text-muted-foreground">
                  🌅 Daily missions reset at midnight
                  <br />
                  📅 Weekly missions reset on Monday
                  <br />
                  📆 Monthly missions reset on the 1st
                </p>
                <div className="mt-4">
                  <p className="text-sm text-secondary">🏆 You&apos;re a true CalistheniX Champion!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          availableMissions.map((mission, index) => {
            const isActive = activeMission && activeMission.title === mission.title
            const missionKey = getMissionKey(mission)
            const isCompleted = completedMissions.includes(missionKey)
          
          // Check if mission can be completed (all requirements met)
          const canComplete = isActive && mission.requirements.every(req => {
            // Check if skill is completed (in completedSkills array) for simple check
            // Or check skillProgress for detailed reps tracking
            const isSkillCompleted = completedSkills.includes(req.skillName)
            const skillProgressForSkill = skillProgress[req.skillName]
            const hasEnoughReps = skillProgressForSkill && skillProgressForSkill.totalReps >= req.targetValue
            
            return isSkillCompleted || hasEnoughReps
          })
          
          return (
            <MissionCard 
              key={mission.title}
              mission={mission}
              isCompleted={isCompleted}
              isActive={isActive}
              userProgress={isActive ? {
                progress: mission.requirements.map(req => {
                  const isSkillCompleted = completedSkills.includes(req.skillName)
                  const skillProgressForSkill = skillProgress[req.skillName]
                  const currentValue = skillProgressForSkill?.totalReps || 0
                  const completed = isSkillCompleted || currentValue >= req.targetValue
                  
                  return {
                    skillName: req.skillName,
                    currentValue: currentValue,
                    targetValue: req.targetValue,
                    completed: completed
                  }
                }),
                isCompleted: isCompleted
              } : null}
              onCompleteMission={canComplete ? handleCompleteMission : null}
              onStartMission={!isActive && !isCompleted && !activeMission ? handleStartMission : null}
            />
          )
        })
        )}
      </div>
    </motion.div>
  )

  const renderAchievements = () => (
    <motion.div
      className="space-y-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-2">
          Service <span className="text-bronze">Medals</span>
        </h1>
        <p className="text-muted-foreground font-bold lowercase tracking-widest text-xs">
          authorized physical credentials and commendations
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {initialBadges.map((badge, index) => (
          <Badge
            key={badge.name}
            name={badge.name}
            description={badge.description}
            icon={badge.icon}
            rarity={badge.rarity}
            earned={index < 4}
            earnedAt={index < 4 ? new Date() : null}
            size="lg"
          />
        ))}
      </div>
    </motion.div>
  )

  const renderVault = () => (
    <motion.div
      className="space-y-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-2">
          OPERATIVE <span className="text-bronze">VAULT</span>
        </h1>
        <p className="text-muted-foreground font-bold lowercase tracking-widest text-xs">
          secure storage for tactical accolades and physical milestones
        </p>
      </div>

      {(!userStats.unlockedBadges || userStats.unlockedBadges.length === 0) ? (
        <Card variant="iron" className="p-20 text-center flex flex-col items-center justify-center border-dashed border-white/10 min-h-[400px]">
           <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5 animate-pulse">
              <Trophy className="w-12 h-12 text-white/10" />
           </div>
           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Vault Empty</h3>
           <p className="text-white/40 max-w-sm mx-auto font-bold lowercase tracking-widest text-xs leading-relaxed">
              telemetry records indicate zero achievements unlocked. initialize missions to record permanent accolades.
           </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map((badge) => {
            const isUnlocked = userStats.unlockedBadges?.includes(badge.id)
            
            return (
              <Card 
                key={badge.id} 
                variant="iron" 
                className={cn(
                  "p-8 relative overflow-hidden transition-all duration-500",
                  isUnlocked ? "border-bronze/30 shadow-[0_0_20px_rgba(205,127,50,0.1)]" : "opacity-40 grayscale border-white/5"
                )}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-4 h-4 text-white/20" />
                  </div>
                )}
                
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-colors",
                  isUnlocked ? "bg-bronze/20 border-bronze/40" : "bg-white/5 border-white/10"
                )}>
                  <Trophy className={cn("w-8 h-8", isUnlocked ? "text-bronze" : "text-white/20")} />
                </div>
                
                <h4 className={cn("text-xl font-black uppercase italic tracking-tighter mb-2", isUnlocked ? "text-white" : "text-white/40")}>
                  {badge.title}
                </h4>
                
                <p className="text-xs font-medium text-white/50 lowercase leading-relaxed">
                  {isUnlocked ? badge.desc : "Requirement: " + badge.desc.split('.')[0] + "."}
                </p>

                {isUnlocked && (
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified</span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </motion.div>
  )

  const renderProgress = () => (
    <motion.div
      className="space-y-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-2">
          Telemetry <span className="text-bronze">Data</span>
        </h1>
        <p className="text-muted-foreground font-bold lowercase tracking-widest text-xs">
          historical analysis of physical progressions and capabilities
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
        <Card variant="iron" className="text-center p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <TrendingUp className="w-16 h-16 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Total XP</div>
             <div className="text-4xl font-black text-primary italic">{userStats.totalXP}</div>
          </div>
        </Card>
        <Card variant="iron" className="text-center p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <Trophy className="w-16 h-16 text-secondary" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Level</div>
             <div className="text-4xl font-black text-bronze italic">{userStats.level}</div>
          </div>
        </Card>
        <Card variant="iron" className="text-center p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <Target className="w-16 h-16 text-purple-400" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Skills Mastered</div>
             <div className="text-4xl font-black text-purple-400 italic">{userStats.skillsCompleted}</div>
          </div>
        </Card>
        <Card variant="iron" className="text-center p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
            <Zap className="w-16 h-16 text-orange-400" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="text-[10px] font-black lowercase tracking-widest text-muted-foreground mb-3">missions done</div>
             <div className="text-4xl font-black text-orange-400 italic">{userStats.missionsCompleted}</div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Skills History */}
        <Card variant="iron" className="border-white/5">
          <Card.Header>
            <Card.Title className="flex items-center gap-2 font-black italic uppercase tracking-tighter text-white">
              <Target className="w-5 h-5 text-primary" />
              Recent Skills ({progressHistory.skillHistory.length})
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {progressHistory.skillHistory.length === 0 ? (
                <p className="text-white/40 text-center py-8 font-black uppercase tracking-widest text-[10px]">No skills completed yet. Initialize training protocols.</p>
              ) : (
                progressHistory.skillHistory
                  .slice(-10) // Show last 10 skills
                  .reverse()
                  .map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                      <div className="flex-1">
                        <div className="font-black text-xs lowercase tracking-wider text-white">{entry.skillName}</div>
                        <div className="text-[10px] font-bold text-white/50 tracking-widest lowercase">
                          {entry.mission ? `protocol: ${entry.mission}` : 'free training'}
                        </div>
                        <div className="text-[8px] font-mono text-white/30 uppercase mt-1">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-black text-bronze">+{entry.xp} XP</div>
                        <div className="text-[10px] font-black tracking-widest uppercase text-white/40">{entry.category}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Mission History */}
        <Card variant="iron" className="border-white/5">
          <Card.Header>
            <Card.Title className="flex items-center gap-2 font-black italic uppercase tracking-tighter text-white">
              <Trophy className="w-5 h-5 text-bronze" />
              Completed Protocols ({progressHistory.missionHistory.length})
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {progressHistory.missionHistory.length === 0 ? (
                <p className="text-white/40 text-center py-8 font-black uppercase tracking-widest text-[10px]">No protocols completed yet. Awaiting initialization.</p>
              ) : (
                progressHistory.missionHistory
                  .slice(-10) // Show last 10 missions
                  .reverse()
                  .map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                      <div className="flex-1">
                        <div className="font-black text-xs uppercase tracking-wider text-white">{entry.missionTitle}</div>
                        <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase">
                          Sub-Routines: {entry.skills?.join(', ') || entry.skillsCompleted?.join(', ') || 'none'}
                        </div>
                        <div className="text-[8px] font-mono text-white/30 uppercase mt-1">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-black text-bronze">+{entry.xp} xp</div>
                        <div className="text-[10px] font-black tracking-widest lowercase text-white/40">{entry.type}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* XP Progress Chart (Simple Version) */}
      <Card variant="iron" className="max-w-5xl mx-auto border-white/5">
        <Card.Header>
          <Card.Title className="flex items-center gap-2 font-black italic uppercase tracking-tighter text-white text-2xl">
            <TrendingUp className="w-6 h-6 text-primary" />
            Performance Telemetry
          </Card.Title>
        </Card.Header>
        <Card.Content>
          {progressHistory.xpHistory.length === 0 ? (
            <p className="text-white/40 text-center py-8 font-black uppercase tracking-widest text-[10px]">Awaiting telemetry data from authorized activities.</p>
          ) : (
            <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
              {progressHistory.xpHistory
                .slice(-7) // Show last 7 entries
                .map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-l-4 border-primary/50 bg-white/5 rounded-r-lg mb-2 pl-4 hover:bg-white/10 transition-colors">
                    <div>
                      <div className="font-black uppercase tracking-wider text-white text-xs">{entry.details}</div>
                      <div className="text-[10px] font-mono text-white/40 uppercase mt-1">{entry.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-black text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">+{entry.xp} XP</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Baseline: <span className="text-white">{entry.total}</span></div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Clear Progress Button (for testing) */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => {
            if (confirm('⚠️ Clear all progress data? This cannot be undone!')) {
              setUserStats({
                totalXP: 0,
                level: 1,
                skillsCompleted: 0,
                missionsCompleted: 0,
                currentStreak: 0,
                longestStreak: 0,
                totalWorkouts: 0
              })
              setProgressHistory({
                skillHistory: [],
                missionHistory: [],
                xpHistory: [],
                streakHistory: []
              })
              localStorage.removeItem('userStats')
              localStorage.removeItem('progressHistory')
              alert('🔄 Progress data cleared!')
            }
          }}
          className="text-xs"
        >
          Clear Progress Data
        </Button>
      </div>
    </motion.div>
  )

  const renderPageContent = () => {
    switch (currentPage) {
      case 'skills':
        return renderSkills()
      case 'missions':
        return renderMissions()
      case 'achievements':
        return renderAchievements()
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-2">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-4">Athlete <span className="text-bronze">Profile</span></h2>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Access biometric records and personal progression history</p>
            </motion.div>
            {session && (
              <div className="space-y-8">
                <UserProfile user={currentUser} showAnimation={true} />
                
                {/* Visual Performance Graph */}
                <Card variant="iron" className="p-8 border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <TrendingUp className="w-32 h-32 text-primary" />
                   </div>
                   
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                         <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Biometric <span className="text-primary">Frequency</span></h4>
                         <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">XP Progression Log</p>
                      </div>
                   </div>

                   {progressHistory.xpHistory.length < 2 ? (
                      <div className="aspect-[21/9] flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/5 border-dashed">
                         <TrendingUp className="w-12 h-12 text-white/10 mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Awaiting sufficient telemetry data to generate frequency map</p>
                      </div>
                   ) : (
                      <div className="space-y-12">
                         {/* Simple Bar Chart */}
                         <div className="aspect-[21/9] flex items-end justify-between gap-2 px-2">
                            {progressHistory.xpHistory.slice(-14).map((entry, idx) => {
                               const maxXP = Math.max(...progressHistory.xpHistory.slice(-14).map(e => e.xp), 50)
                               const height = (entry.xp / maxXP) * 100
                               return (
                                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                                     {/* Tooltip */}
                                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                                        {entry.xp} XP | {entry.date}
                                     </div>
                                     
                                     <motion.div 
                                        className="w-full bg-primary/20 border-t-2 border-primary rounded-t-sm group-hover:bg-primary/40 transition-colors relative"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                                     >
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary/20" />
                                     </motion.div>
                                  </div>
                               )
                            })}
                         </div>
                         
                         {/* Legend */}
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20 pt-4 border-t border-white/5">
                            <span>{progressHistory.xpHistory.slice(-14)[0]?.date}</span>
                            <span className="text-primary/40 italic">Telemetry stream: active</span>
                            <span>{progressHistory.xpHistory.slice(-1)[0]?.date}</span>
                         </div>
                      </div>
                   )}
                </Card>

                {/* Detailed Log */}
                <Card variant="iron" className="p-8 border-white/5">
                   <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">Activity Logs</h4>
                   <div className="space-y-3">
                      {progressHistory.xpHistory.slice(-5).reverse().map((entry, idx) => (
                         <div key={idx} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl text-xs font-black lowercase tracking-tight">
                            <div className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-primary/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                               <span className="text-white/60">{entry.details}</span>
                            </div>
                            <span className="text-primary">+{entry.xp} XP</span>
                         </div>
                      ))}
                   </div>
                </Card>
              </div>
            )}
          </div>
        )
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto py-20">
            <div className="space-y-12">
              <div className="flex flex-col space-y-2">
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground mb-4">System <span className="text-primary">Configuration</span></h2>
                 <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Manage terminal authorization and environment parameters</p>
              </div>
              
              <Card variant="iron" className="p-8 border-white/5">
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-xl">
                    <div className="space-y-1">
                      <div className="text-xs font-black uppercase tracking-widest text-white">Terminal Authorization</div>
                      <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Active Session Management</div>
                    </div>
                    {session ? (
                      <Button variant="glass" onClick={() => signOut()}>
                        logout
                      </Button>
                    ) : (
                      <Button variant="cyber" onClick={() => signIn('google')}>
                        login
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )
      case 'achievements':
        return renderVault()
      case 'progress':
        return renderProgress()
      default:
        return renderDashboard()
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="md:ml-64 p-6 pb-20 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPageContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
