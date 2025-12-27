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
  
  // Workout state
  const [activeWorkouts, setActiveWorkouts] = useState({})

  // Load skills from database on component mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoadingSkills(true)
        const response = await fetch('/api/skills')
        
        if (response.ok) {
          const data = await response.json()
          setSkills(data.skills)
          
          // Extract completed skills from user progress
          const completed = data.skills
            .filter(skill => skill.isUnlocked && skill.userProgress?.masteryLevel > 0)
            .map(skill => skill.name)
          setCompletedSkills(completed)
          
          console.log('Skills loaded:', data.skills.length, 'completed:', completed.length)
        } else if (response.status === 404 || response.status === 500) {
          // If no skills exist, seed the database
          console.log('No skills found, seeding database...')
          const seedResponse = await fetch('/api/seed', { method: 'POST' })
          if (seedResponse.ok) {
            // Retry loading skills after seeding
            const retryResponse = await fetch('/api/skills')
            if (retryResponse.ok) {
              const data = await retryResponse.json()
              setSkills(data.skills)
            }
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
  
  // Mock user data for demonstration
  const mockUser = session ? {
    ...session.user,
    xp: 1250,
    level: 8,
    totalWorkouts: 45,
    currentStreak: 7,
    longestStreak: 12,
    unlockedSkills: [
      { skillId: '1', masteryLevel: 3, bestPerformance: { reps: 15 } },
      { skillId: '2', masteryLevel: 2, bestPerformance: { reps: 8 } },
      { skillId: '3', masteryLevel: 4, bestPerformance: { reps: 25 } },
    ],
    badges: [
      { badgeId: '1', earnedAt: new Date() },
      { badgeId: '2', earnedAt: new Date() }
    ]
  } : null

  const handleStartMission = (mission) => {
    // Only allow one active mission at a time
    if (activeMission) {
      alert(`❌ You already have an active mission: "${activeMission.title}"\n\nComplete or cancel it first before starting a new one.`)
      return
    }
    
    setActiveMission(mission)
    console.log(`Mission "${mission.title}" started!`)
    alert(`🎯 Mission "${mission.title}" started!\n\n✅ Go to Skills page\n✅ Complete the required skills:\n${mission.requirements.map(req => `• ${req.skillName}: ${req.targetValue} ${req.unit}`).join('\n')}\n✅ Come back when done to complete the mission`)
  }

  const handleCompleteSkill = async (skill) => {
    console.log('handleCompleteSkill called with:', skill.name)
    
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
      
      if (!response.ok) {
        throw new Error('Failed to save skill progress')
      }
      
      const result = await response.json()
      console.log('Skill progress saved:', result)
      
      // Update local state after successful database save
      setCompletedSkills(prev => [...prev, skill.name])
      
      setSkillProgress(prev => ({
        ...prev,
        [skill.name]: {
          ...prev[skill.name],
          totalReps: targetReps,
          lastWorkout: new Date(),
          completedSessions: (prev[skill.name]?.completedSessions || 0) + 1,
          bestSingleSession: targetReps
        }
      }))
      
      console.log('Skill completed successfully')
      alert(`🎉 ${skill.name} completed!\n\n✅ Skill progress saved to database!\n🎯 XP Earned: ${result.xpEarned}${activeMission ? '\n💪 Check your mission progress!' : ''}`)
      
    } catch (error) {
      console.error('Error completing skill:', error)
      alert(`❌ Error saving skill progress: ${error.message}\n\nPlease try again.`)
    }
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
        const skillProgressForSkill = skillProgress[req.skillName]
        return skillProgressForSkill && skillProgressForSkill.totalReps >= req.targetValue
      })
      
      if (!requirementsMet) {
        alert(`❌ Mission requirements not met!\n\nYou still need to complete:\n${
          mission.requirements
            .filter(req => !skillProgress[req.skillName] || skillProgress[req.skillName].totalReps < req.targetValue)
            .map(req => `• ${req.skillName}: ${skillProgress[req.skillName]?.totalReps || 0}/${req.targetValue} ${req.unit}`)
            .join('\n')
        }\n\nGo to Skills page and complete more skills!`)
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mark mission as completed
      setCompletedMissions(prev => [...prev, mission.id])
      setActiveMission(null) // Clear active mission
      
      // Update user progress (simulate XP gain)
      console.log(`Mission "${mission.title}" completed! +${mission.xpReward} XP`)
      
      // Show success notification
      alert(`🎉 Mission "${mission.title}" completed!\n\n✅ +${mission.xpReward} XP earned!\n✅ Skills trained: ${mission.requirements.map(req => req.skillName).join(', ')}\n\nGreat work, warrior!`)
      
    } catch (error) {
      console.error('Failed to complete mission:', error)
      alert('Failed to complete mission. Please try again.')
    }
  }
  
  const handleCancelMission = () => {
    if (!activeMission) return
    
    const confirmed = confirm(`⚠️ Cancel active mission "${activeMission.title}"?\n\nAll progress will be lost.`)
    
    if (confirmed) {
      setActiveMission(null)
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
          <UserProfile user={mockUser} />
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

      {/* Quick Stats Grid */}
      {session && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-primary/20 to-primary/5">
              <Target className="w-8 h-8 mx-auto text-primary mb-3" />
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Skills Unlocked</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-secondary/20 to-secondary/5">
              <Zap className="w-8 h-8 mx-auto text-secondary mb-3" />
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Active Missions</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-500/5">
              <Trophy className="w-8 h-8 mx-auto text-purple-400 mb-3" />
              <div className="text-2xl font-bold text-foreground">8</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-orange-500/5">
              <Calendar className="w-8 h-8 mx-auto text-orange-400 mb-3" />
              <div className="text-2xl font-bold text-foreground">7</div>
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

  const renderSkills = () => (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text mb-2">Skill Tree</h1>
        <p className="text-muted-foreground">
          Master the fundamentals and unlock advanced moves
        </p>
        
        {/* Active Mission Info */}
        {activeMission && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold text-primary mb-2">Active Mission: {activeMission.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{activeMission.description}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {activeMission.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-full text-xs ${
                      completedSkills.includes(req.skillName)
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {completedSkills.includes(req.skillName) ? '✅' : '⏳'} {req.skillName}: {req.targetValue} {req.unit}
                  </span>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelMission}
                className="mt-2"
              >
                Cancel Mission
              </Button>
            </div>
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
        ) : (
          skills.map((skill, index) => {
            const isRequiredForActiveMission = activeMission?.requirements.some(req => req.skillName === skill.name)
            const isUnlocked = skill.isUnlocked || index < 8 || isRequiredForActiveMission // Auto-unlock mission-required skills
            const skillProgressData = skillProgress[skill.name]
            const isCompleted = completedSkills.includes(skill.name)
            
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
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">Mission Center</h1>
        <p className="text-muted-foreground">
          Complete missions to earn XP and unlock new challenges
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {initialMissions.map((mission, index) => {
          const isActive = activeMission && activeMission.title === mission.title
          const isCompleted = completedMissions.includes(mission.id)
          
          // Check if mission can be completed (all requirements met)
          const canComplete = isActive && mission.requirements.every(req => {
            const skillProgressForSkill = skillProgress[req.skillName]
            return skillProgressForSkill && skillProgressForSkill.totalReps >= req.targetValue
          })
          
          return (
            <MissionCard 
              key={mission.title}
              mission={mission}
              isCompleted={isCompleted}
              isActive={isActive}
              userProgress={isActive ? {
                progress: mission.requirements.map(req => ({
                  skillName: req.skillName,
                  currentValue: skillProgress[req.skillName]?.totalReps || 0,
                  targetValue: req.targetValue,
                  completed: (skillProgress[req.skillName]?.totalReps || 0) >= req.targetValue
                })),
                isCompleted: isCompleted
              } : null}
              onCompleteMission={canComplete ? handleCompleteMission : null}
              onStartMission={!isActive && !isCompleted && !activeMission ? handleStartMission : null}
            />
          )
        })}
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
            {session && <UserProfile user={mockUser} />}
          </div>
        )
      case 'progress':
        return (
          <div className="text-center py-20">
            <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Progress Tracking</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        )
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
