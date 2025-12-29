'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, signOut, useSession } from 'next-auth/react'
import { 
  Zap, 
  Target, 
  Trophy, 
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  LogIn
} from 'lucide-react'

import Navigation from '@/components/Navigation'
import UserProfile from '@/components/UserProfile'
import SkillCard from '@/components/SkillCard'
import MissionCard from '@/components/MissionCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

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

export default function Home() {
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState('dashboard')
  
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
    skillsCompleted: 0,
    missionsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0
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
  }, [])
  
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
    console.log('🎯 Current activeMission:', activeMission?.title)
    
    // Only allow one active mission at a time
    if (activeMission) {
      alert(`❌ You already have an active mission: "${activeMission.title}"\n\nComplete or cancel it first before starting a new one.`)
      return
    }
    
    console.log('🎯 Setting active mission to:', mission.title)
    setActiveMission(mission)
    
    // Save to localStorage for persistence
    localStorage.setItem('activeMission', JSON.stringify(mission))
    console.log(`Mission "${mission.title}" started!`)
    alert(`🎯 Mission "${mission.title}" started!\n\n✅ Go to Skills page\n✅ Complete the required skills:\n${mission.requirements.map(req => `• ${req.skillName}: ${req.targetValue} ${req.unit}`).join('\n')}\n✅ Come back when done to complete the mission`)
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
    
    // Check if skill is already completed
    if (completedSkills.includes(skill.name)) {
      console.log('Skill already completed')
      alert(`✅ You've already completed ${skill.name}!`)
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
          alert(`🎉 Mission "${mission.title}" completed!\n\n✅ +${missionXP} XP earned!\n✅ Skills trained: ${mission.requirements.map(req => req.skillName).join(', ')}\n🏆 Level ${Math.floor((userStats.totalXP + missionXP) / 100) + 1}!\n\n🚀 ${remainingMissions.length} more missions available!\nChoose your next mission to keep the momentum going!`)
          
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
      const missionXP = mission.xpReward || 50
      const now = new Date()
      
      // Update user stats for mission completion
      setUserStats(prev => {
        const newTotalXP = prev.totalXP + missionXP
        const newLevel = Math.floor(newTotalXP / 100) + 1
        const newStats = {
          ...prev,
          totalXP: newTotalXP,
          level: newLevel,
          missionsCompleted: prev.missionsCompleted + 1
        }
        localStorage.setItem('userStats', JSON.stringify(newStats))
        return newStats
      })
      
      // Add to mission history
      setProgressHistory(prev => {
        const newHistory = {
          ...prev,
          missionHistory: [
            ...prev.missionHistory,
            {
              missionTitle: mission.title,
              xp: missionXP,
              timestamp: now.toISOString(),
              skills: mission.requirements.map(req => req.skillName),
              difficulty: mission.category,
              type: mission.type
            }
          ],
          xpHistory: [
            ...prev.xpHistory,
            {
              date: now.toISOString().split('T')[0],
              xp: missionXP,
              total: userStats.totalXP + missionXP,
              source: 'mission',
              details: mission.title
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
    
    console.log(`Started new mission: ${mission.title} (from Mission Center)`)
    alert(`🚀 New Mission Started!\n\n🎯 Mission: ${mission.title}\n📝 ${mission.description}\n\n✅ Requirements:\n${mission.requirements.map(req => `• ${req.skillName}: ${req.targetValue} ${req.unit}`).join('\n')}\n\nGood luck, warrior!`)
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
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold gradient-text"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to CalistheniX
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your bodyweight training into an epic gaming adventure. 
          Level up your skills, complete missions, and become the ultimate calisthenics warrior.
        </p>
      </div>

      {/* User Profile or Sign In */}
      <div className="max-w-4xl mx-auto">
        {session ? (
          <UserProfile user={currentUser} />
        ) : (
          <Card className="text-center p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <Zap className="w-16 h-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ready to Level Up?</h2>
                <p className="text-muted-foreground">
                  Sign in to start your calisthenics journey and unlock your potential
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="cyber" 
                  size="lg" 
                  onClick={() => signIn('google')}
                  className="w-full"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => signIn()}
                  className="w-full"
                >
                  Other sign in options
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Mission System Info */}
      {session && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-border rounded-lg p-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Mission System</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Complete multiple missions in the same day, week, or month to maximize your XP gains! 
              Each mission type resets on schedule: Daily (midnight), Weekly (Monday), Monthly (1st of month).
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      {session && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-primary/20 to-primary/5">
              <Target className="w-8 h-8 mx-auto text-primary mb-3" />
              <div className="text-2xl font-bold text-foreground">{userStats.skillsCompleted}</div>
              <div className="text-sm text-muted-foreground">Skills Completed</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-secondary/20 to-secondary/5">
              <Zap className="w-8 h-8 mx-auto text-secondary mb-3" />
              <div className="text-2xl font-bold text-foreground">{userStats.missionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Missions Completed</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-500/5">
              <Trophy className="w-8 h-8 mx-auto text-purple-400 mb-3" />
              <div className="text-2xl font-bold text-foreground">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-orange-500/5">
              <Calendar className="w-8 h-8 mx-auto text-orange-400 mb-3" />
              <div className="text-2xl font-bold text-foreground">{userStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Featured Skills Preview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center gradient-text">
          Master These Skills
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skills.slice(0, 3).map((skill, index) => (
            <motion.div
              key={skill._id || skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkillCard 
                skill={skill}
                isUnlocked={skill.isUnlocked || index === 0}
                onStartSkill={() => setCurrentPage('skills')}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('skills')}
          >
            View All Skills
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
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
  }, [completedSkills, activeMission])

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
  }, [activeMission, skills.length, session, loadingSkills])

  const renderSkills = () => (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {activeMission ? `🎯 ${activeMission.title} Skills` : 'Skill Tree'}
        </h1>
        <p className="text-muted-foreground">
          {activeMission 
            ? `Complete these ${activeMission.requirements.length} skills to finish your mission and earn ${activeMission.xpReward} XP!` 
            : 'Master the fundamentals and unlock advanced moves'
          }
        </p>
        
        {/* Mission Progress Bar */}
        {activeMission && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-primary">Mission Progress</h3>
              <span className="text-sm text-muted-foreground">
                {activeMission.requirements.filter(req => completedSkills.includes(req.skillName)).length}/{activeMission.requirements.length} Skills
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{
                  width: `${(activeMission.requirements.filter(req => completedSkills.includes(req.skillName)).length / activeMission.requirements.length) * 100}%`
                }}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {activeMission.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      completedSkills.includes(req.skillName)
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {completedSkills.includes(req.skillName) ? '✅' : '⏳'} {req.skillName}: {req.targetValue} {req.unit}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelMission}
                >
                  Cancel Mission
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage('missions')}
                >
                  Back to Missions
                </Button>
              </div>
            </div>
          </div>
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
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {req.skillName}: {req.targetValue} {req.unit}
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
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Mission Center</h1>
        <p className="text-muted-foreground mb-4">
          Complete missions to earn XP and unlock new challenges
        </p>
        
        {/* Mission Period Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-sm font-semibold text-blue-400">Daily Missions</div>
            <div className="text-xs text-muted-foreground">
              {getAvailableMissionsByType(initialMissions, 'daily').length} available today
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="text-sm font-semibold text-purple-400">Weekly Missions</div>
            <div className="text-xs text-muted-foreground">
              {getAvailableMissionsByType(initialMissions, 'weekly').length} available this week
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
            <div className="text-sm font-semibold text-orange-400">Monthly Challenges</div>
            <div className="text-xs text-muted-foreground">
              {getAvailableMissionsByType(initialMissions, 'monthly').length} available this month
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {availableMissions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground space-y-4">
              <Trophy className="w-16 h-16 mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">All Missions Completed!</h3>
                <p className="text-sm">
                  Incredible! You've completed all available missions for this period.
                </p>
                <p className="text-xs mt-2 text-muted-foreground">
                  🌅 Daily missions reset at midnight
                  <br />
                  📅 Weekly missions reset on Monday
                  <br />
                  📆 Monthly missions reset on the 1st
                </p>
                <div className="mt-4">
                  <p className="text-sm text-secondary">🏆 You're a true CalistheniX Champion!</p>
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
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">Achievements</h1>
        <p className="text-muted-foreground">
          Your collection of hard-earned badges and trophies
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

  const renderProgress = () => (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text mb-2">Progress Tracking</h1>
        <p className="text-muted-foreground">Your journey and achievements over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">{userStats.totalXP}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-secondary">{userStats.level}</div>
          <div className="text-sm text-muted-foreground">Level</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-400">{userStats.skillsCompleted}</div>
          <div className="text-sm text-muted-foreground">Skills</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-400">{userStats.missionsCompleted}</div>
          <div className="text-sm text-muted-foreground">Missions</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Skills History */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Recent Skills ({progressHistory.skillHistory.length})
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {progressHistory.skillHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No skills completed yet. Start training!</p>
              ) : (
                progressHistory.skillHistory
                  .slice(-10) // Show last 10 skills
                  .reverse()
                  .map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{entry.skillName}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.mission ? `Mission: ${entry.mission}` : 'Free Training'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-secondary">+{entry.xp} XP</div>
                        <div className="text-xs text-muted-foreground">{entry.category}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Mission History */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Completed Missions ({progressHistory.missionHistory.length})
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {progressHistory.missionHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No missions completed yet. Start your first mission!</p>
              ) : (
                progressHistory.missionHistory
                  .slice(-10) // Show last 10 missions
                  .reverse()
                  .map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{entry.missionTitle}</div>
                        <div className="text-xs text-muted-foreground">
                          Skills: {entry.skills.join(', ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-secondary">+{entry.xp} XP</div>
                        <div className="text-xs text-muted-foreground">{entry.type}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* XP Progress Chart (Simple Version) */}
      <Card className="max-w-4xl mx-auto">
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            XP Progress Over Time
          </Card.Title>
        </Card.Header>
        <Card.Content>
          {progressHistory.xpHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Start completing skills and missions to see your progress!</p>
          ) : (
            <div className="space-y-2">
              {progressHistory.xpHistory
                .slice(-7) // Show last 7 entries
                .map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-l-4 border-primary/30 pl-4">
                    <div>
                      <div className="text-sm font-semibold">{entry.details}</div>
                      <div className="text-xs text-muted-foreground">{entry.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-primary">+{entry.xp} XP</div>
                      <div className="text-xs text-muted-foreground">Total: {entry.total}</div>
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
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">Profile</h2>
              <p className="text-muted-foreground">Your CalistheniX journey and achievements</p>
            </motion.div>
            {session && <UserProfile user={currentUser} />}
          </div>
        )
      case 'progress':
        return renderProgress()
      case 'settings':
        return (
          <div className="text-center py-20">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold gradient-text">Settings</h2>
              {session && (
                <Button variant="destructive" onClick={() => signOut()}>
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )
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
