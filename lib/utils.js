import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// XP and Level calculations
export const calculateXPForLevel = (level) => {
  const baseXP = 100
  return Math.floor(baseXP * Math.pow(1.5, level - 1))
}

export const calculateLevelFromXP = (xp) => {
  const baseXP = 100
  let level = 1
  let totalXPNeeded = 0
  
  while (totalXPNeeded <= xp) {
    totalXPNeeded += baseXP * Math.pow(1.5, level - 1)
    if (totalXPNeeded <= xp) {
      level++
    }
  }
  
  return level
}

export const getXPProgressForCurrentLevel = (xp, level) => {
  const currentLevelXP = calculateXPForLevel(level)
  const nextLevelXP = calculateXPForLevel(level + 1)
  const progressXP = xp - currentLevelXP
  const levelXPRange = nextLevelXP - currentLevelXP
  
  return {
    current: Math.max(0, progressXP),
    needed: levelXPRange,
    percentage: Math.max(0, Math.min(100, (progressXP / levelXPRange) * 100))
  }
}

// Format numbers for display
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Time formatting
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

// Date formatting
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

// Streak calculations
export const calculateStreak = (workoutDates) => {
  if (!workoutDates || workoutDates.length === 0) return 0
  
  const sortedDates = workoutDates
    .map(date => new Date(date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a))
  
  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  // Check if last workout was today or yesterday
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    streak = 1
    
    // Count consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i-1])
      const previousDate = new Date(sortedDates[i])
      const diffTime = currentDate - previousDate
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }
  }
  
  return streak
}

// Skill difficulty colors and labels
export const getDifficultyConfig = (difficulty) => {
  const configs = {
    1: { label: 'Beginner', color: 'text-green-400', bg: 'bg-green-400/20' },
    2: { label: 'Beginner', color: 'text-green-400', bg: 'bg-green-400/20' },
    3: { label: 'Novice', color: 'text-blue-400', bg: 'bg-blue-400/20' },
    4: { label: 'Novice', color: 'text-blue-400', bg: 'bg-blue-400/20' },
    5: { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    6: { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    7: { label: 'Advanced', color: 'text-orange-400', bg: 'bg-orange-400/20' },
    8: { label: 'Advanced', color: 'text-orange-400', bg: 'bg-orange-400/20' },
    9: { label: 'Expert', color: 'text-red-400', bg: 'bg-red-400/20' },
    10: { label: 'Master', color: 'text-purple-400', bg: 'bg-purple-400/20' }
  }
  
  return configs[difficulty] || configs[1]
}

// Badge rarity configurations
export const getRarityConfig = (rarity) => {
  const configs = {
    common: { 
      label: 'Common', 
      color: 'text-gray-400', 
      bg: 'bg-gray-400/20',
      glow: 'shadow-gray-400/20'
    },
    rare: { 
      label: 'Rare', 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/20',
      glow: 'shadow-blue-400/30'
    },
    epic: { 
      label: 'Epic', 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/20',
      glow: 'shadow-purple-400/40'
    },
    legendary: { 
      label: 'Legendary', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/20',
      glow: 'shadow-yellow-400/50'
    }
  }
  
  return configs[rarity] || configs.common
}