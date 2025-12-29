/**
 * Mission Levels and Achievement System
 * Comprehensive categorization of all missions by difficulty level
 * with skill badges, milestones, and prerequisite logic
 */

// ==================== MISSION LEVEL DEFINITIONS ====================

export const missionLevels = {
  BEGINNER: 'beginner',
  FAT_BURN: 'fat-burn',
  INTERMEDIATE: 'intermediate',
  PRO: 'pro'
}

export const levelDetails = {
  [missionLevels.BEGINNER]: {
    title: 'The Foundation',
    description: 'Building basic strength, tendon durability, and introductory muscle endurance.',
    color: 'from-blue-500 to-blue-600',
    icon: '🌱',
    minXP: 0,
    maxXP: 500,
    order: 1
  },
  [missionLevels.FAT_BURN]: {
    title: 'The Metabolic Engine',
    description: 'High-intensity movements and cardiovascular endurance to maximize calorie expenditure.',
    color: 'from-red-500 to-orange-600',
    icon: '🔥',
    minXP: 500,
    maxXP: 1500,
    order: 2
  },
  [missionLevels.INTERMEDIATE]: {
    title: 'The Progression',
    description: 'Mastering leverage, unilateral (single-limb) movements, and increased volume.',
    color: 'from-purple-500 to-purple-600',
    icon: '📈',
    minXP: 1500,
    maxXP: 3000,
    order: 3
  },
  [missionLevels.PRO]: {
    title: 'The Mastery',
    description: 'Static holds, elite leverage (Levers/Flags), and high-difficulty skills.',
    color: 'from-yellow-500 to-yellow-600',
    icon: '👑',
    minXP: 3000,
    maxXP: Infinity,
    order: 4
  }
}

// ==================== CATEGORIZED MISSIONS ====================

export const categorizedMissions = {
  [missionLevels.BEGINNER]: {
    level: missionLevels.BEGINNER,
    missions: [
      {
        id: 'beginner-push-foundation',
        title: 'Push Foundation',
        day: 'Monday',
        emoji: '💪',
        skills: ['Push-up', 'Push-up'],
        description: 'Master basic pushing movements',
        xpReward: 60,
        difficulty: 1,
        prerequisites: []
      },
      {
        id: 'beginner-pull-foundation',
        title: 'Pull Foundation Tuesday',
        day: 'Tuesday',
        emoji: '🔥',
        skills: ['Pull-up', 'Dead Hang'],
        description: 'Build foundational pulling strength',
        xpReward: 60,
        difficulty: 1,
        prerequisites: []
      },
      {
        id: 'beginner-core-foundation',
        title: 'Core Foundation',
        day: 'Wednesday',
        emoji: '💎',
        skills: ['Plank', 'Hollow Body Hold'],
        description: 'Develop core stability and strength',
        xpReward: 55,
        difficulty: 1,
        prerequisites: []
      },
      {
        id: 'beginner-legs-foundation',
        title: 'Legs Foundation',
        day: 'Thursday',
        emoji: '🦵',
        skills: ['Squat', 'Jump Squat'],
        description: 'Build leg strength and power',
        xpReward: 60,
        difficulty: 1,
        prerequisites: []
      },
      {
        id: 'beginner-full-body',
        title: 'Full Body Friday',
        day: 'Friday',
        emoji: '🌟',
        skills: ['Push-up', 'Dead Hang', 'Squat'],
        description: 'Complete full-body workout',
        xpReward: 80,
        difficulty: 2,
        prerequisites: []
      },
      {
        id: 'beginner-mobility',
        title: 'Sunday Mobility',
        day: 'Sunday',
        emoji: '🧘',
        skills: ['Hollow Body Hold'],
        description: 'Improve flexibility and mobility',
        xpReward: 30,
        difficulty: 1,
        prerequisites: []
      }
    ]
  },

  [missionLevels.FAT_BURN]: {
    level: missionLevels.FAT_BURN,
    missions: [
      {
        id: 'fatburn-saturday-endurance',
        title: 'Saturday Endurance',
        day: 'Saturday',
        emoji: '💥',
        skills: ['Push-up x50', 'Burpee x20'],
        description: 'High-volume push and explosive work',
        xpReward: 90,
        difficulty: 4,
        prerequisites: [
          { missionId: 'beginner-push-foundation', minCompletions: 3 }
        ]
      },
      {
        id: 'fatburn-saturday-explosive',
        title: 'Saturday Explosive',
        day: 'Saturday',
        emoji: '⚡',
        skills: ['Jump Squat x25'],
        description: 'Explosive leg power development',
        xpReward: 75,
        difficulty: 4,
        prerequisites: [
          { missionId: 'beginner-legs-foundation', minCompletions: 3 }
        ]
      },
      {
        id: 'fatburn-combination-friday',
        title: 'Combination Friday',
        day: 'Friday',
        emoji: '🎯',
        skills: ['Burpee x15', 'Handstand'],
        description: 'High-intensity combination movements',
        xpReward: 100,
        difficulty: 5,
        prerequisites: [
          { missionId: 'beginner-full-body', minCompletions: 4 }
        ]
      },
      {
        id: 'fatburn-monthly-century',
        title: 'Century Pusher',
        day: 'Monthly',
        emoji: '🏆',
        skills: ['Push-up x100'],
        description: 'Complete 100 push-ups in one month',
        xpReward: 150,
        difficulty: 5,
        prerequisites: [
          { missionId: 'beginner-push-foundation', minCompletions: 8 }
        ]
      }
    ]
  },

  [missionLevels.INTERMEDIATE]: {
    level: missionLevels.INTERMEDIATE,
    missions: [
      {
        id: 'intermediate-push-progression',
        title: 'Push Progression Monday',
        day: 'Monday',
        emoji: '💪',
        skills: ['Pike Push-up'],
        description: 'Master shoulder-focused variations',
        xpReward: 70,
        difficulty: 4,
        prerequisites: [
          { missionId: 'beginner-push-foundation', minCompletions: 5 }
        ]
      },
      {
        id: 'intermediate-pull-progression',
        title: 'Pull Progression Tuesday',
        day: 'Tuesday',
        emoji: '🔥',
        skills: ['Chin-up'],
        description: 'Advance pulling strength and control',
        xpReward: 75,
        difficulty: 4,
        prerequisites: [
          { missionId: 'beginner-pull-foundation', minCompletions: 5 }
        ]
      },
      {
        id: 'intermediate-core-advanced',
        title: 'Advanced Core',
        day: 'Wednesday',
        emoji: '💎',
        skills: ['L-sit', 'V-sit'],
        description: 'Master advanced core holds',
        xpReward: 75,
        difficulty: 5,
        prerequisites: [
          { missionId: 'beginner-core-foundation', minCompletions: 5 }
        ]
      },
      {
        id: 'intermediate-legs-progression',
        title: 'Legs Progression Thursday',
        day: 'Thursday',
        emoji: '🦵',
        skills: ['Pistol Squat'],
        description: 'Progress to unilateral leg strength',
        xpReward: 75,
        difficulty: 5,
        prerequisites: [
          { missionId: 'beginner-legs-foundation', minCompletions: 5 }
        ]
      },
      {
        id: 'intermediate-leverage-sunday',
        title: 'Sunday Leverage',
        day: 'Sunday',
        emoji: '⏱️',
        skills: ['Handstand x60s'],
        description: 'Build leverage and balance skills',
        xpReward: 70,
        difficulty: 5,
        prerequisites: [
          { missionId: 'beginner-mobility', minCompletions: 4 }
        ]
      },
      {
        id: 'intermediate-diamond-pushup',
        title: 'One Arm Push Monday',
        day: 'Monday',
        emoji: '💪',
        skills: ['Diamond Push-up'],
        description: 'Prepare for advanced pushing',
        xpReward: 65,
        difficulty: 4,
        prerequisites: [
          { missionId: 'intermediate-push-progression', minCompletions: 3 }
        ]
      }
    ]
  },

  [missionLevels.PRO]: {
    level: missionLevels.PRO,
    missions: [
      {
        id: 'pro-archer-pull',
        title: 'Archer Pull Monday',
        day: 'Monday',
        emoji: '🏹',
        skills: ['Archer Pull-up'],
        description: 'Master unilateral pulling power',
        xpReward: 120,
        difficulty: 7,
        prerequisites: [
          { missionId: 'intermediate-pull-progression', minCompletions: 8 }
        ]
      },
      {
        id: 'pro-front-lever',
        title: 'Front Lever Wednesday',
        day: 'Wednesday',
        emoji: '🌊',
        skills: ['Front Lever'],
        description: 'Elite leverage skill development',
        xpReward: 150,
        difficulty: 9,
        prerequisites: [
          { missionId: 'intermediate-core-advanced', minCompletions: 8 },
          { missionId: 'intermediate-pull-progression', minCompletions: 8 }
        ]
      },
      {
        id: 'pro-shrimp-squat',
        title: 'Shrimp Squat Thursday',
        day: 'Thursday',
        emoji: '🦐',
        skills: ['Shrimp Squat'],
        description: 'Master unilateral leg strength',
        xpReward: 120,
        difficulty: 8,
        prerequisites: [
          { missionId: 'intermediate-legs-progression', minCompletions: 8 }
        ]
      },
      {
        id: 'pro-ultimate-combo',
        title: 'Ultimate Combo Friday',
        day: 'Friday',
        emoji: '💫',
        skills: ['Muscle-up'],
        description: 'Combine pushing and pulling mastery',
        xpReward: 150,
        difficulty: 9,
        prerequisites: [
          { missionId: 'pro-archer-pull', minCompletions: 5 },
          { missionId: 'intermediate-push-progression', minCompletions: 8 }
        ]
      },
      {
        id: 'pro-back-lever',
        title: 'Saturday Back Lever',
        day: 'Saturday',
        emoji: '🔄',
        skills: ['Back Lever'],
        description: 'Master inverted leverage skills',
        xpReward: 150,
        difficulty: 9,
        prerequisites: [
          { missionId: 'intermediate-core-advanced', minCompletions: 8 },
          { missionId: 'pro-front-lever', minCompletions: 5 }
        ]
      },
      {
        id: 'pro-human-flag',
        title: 'Sunday Flag Progression',
        day: 'Sunday',
        emoji: '🚩',
        skills: ['Human Flag'],
        description: 'Ultimate shoulder and core skill',
        xpReward: 150,
        difficulty: 9,
        prerequisites: [
          { missionId: 'intermediate-leverage-sunday', minCompletions: 8 },
          { missionId: 'intermediate-push-progression', minCompletions: 8 }
        ]
      },
      {
        id: 'pro-one-arm-pull',
        title: 'One Arm Pull Tuesday',
        day: 'Tuesday',
        emoji: '🎯',
        skills: ['One Arm Pull-up'],
        description: 'Ultimate unilateral pulling power',
        xpReward: 150,
        difficulty: 9,
        prerequisites: [
          { missionId: 'pro-archer-pull', minCompletions: 8 }
        ]
      },
      {
        id: 'pro-handstand-pushup',
        title: 'Ultimate Test Friday',
        day: 'Friday',
        emoji: '🌟',
        skills: ['Handstand Push-up'],
        description: 'Ultimate pressing achievement',
        xpReward: 150,
        difficulty: 9,
        prerequisites: [
          { missionId: 'intermediate-push-progression', minCompletions: 8 },
          { missionId: 'intermediate-leverage-sunday', minCompletions: 8 }
        ]
      }
    ]
  }
}

// ==================== SKILL BADGES ====================

export const skillBadges = [
  {
    id: 'hydraulic-press',
    title: 'Hydraulic Press',
    category: 'push',
    icon: '⬆️',
    description: 'Master all pushing movements',
    rarity: 'rare',
    unlockCondition: {
      requiredMissions: [
        'beginner-push-foundation',
        'intermediate-push-progression',
        'pro-handstand-pushup'
      ],
      minCompletions: 5
    }
  },
  {
    id: 'iron-anchor',
    title: 'Iron Anchor',
    category: 'pull',
    icon: '⚓',
    description: 'Become a pulling powerhouse',
    rarity: 'rare',
    unlockCondition: {
      requiredMissions: [
        'beginner-pull-foundation',
        'intermediate-pull-progression',
        'pro-archer-pull'
      ],
      minCompletions: 5
    }
  },
  {
    id: 'midsection-monk',
    title: 'Midsection Monk',
    category: 'core',
    icon: '🏔️',
    description: 'Perfect core strength and stability',
    rarity: 'rare',
    unlockCondition: {
      requiredMissions: [
        'beginner-core-foundation',
        'intermediate-core-advanced',
        'pro-front-lever'
      ],
      minCompletions: 5
    }
  },
  {
    id: 'piston-power',
    title: 'Piston Power',
    category: 'legs',
    icon: '🏔️',
    description: 'Dominate leg exercises',
    rarity: 'rare',
    unlockCondition: {
      requiredMissions: [
        'beginner-legs-foundation',
        'intermediate-legs-progression',
        'pro-shrimp-squat'
      ],
      minCompletions: 5
    }
  },
  {
    id: 'total-kinetic',
    title: 'Total Kinetic',
    category: 'combination',
    icon: '⚙️',
    description: 'Master combination movements',
    rarity: 'epic',
    unlockCondition: {
      requiredMissions: [
        'fatburn-combination-friday',
        'pro-ultimate-combo',
        'pro-human-flag'
      ],
      minCompletions: 5
    }
  },
  {
    id: 'eternal-battery',
    title: 'Eternal Battery',
    category: 'endurance',
    icon: '🔋',
    description: 'Legendary endurance and stamina',
    rarity: 'epic',
    unlockCondition: {
      requiredMissions: [
        'fatburn-saturday-endurance',
        'fatburn-saturday-explosive',
        'fatburn-monthly-century'
      ],
      minCompletions: 8
    }
  },
  {
    id: 'gravity-defier',
    title: 'Gravity Defier',
    category: 'leverage',
    icon: '☄️',
    description: 'Master all leverage skills',
    rarity: 'legendary',
    unlockCondition: {
      requiredMissions: [
        'pro-front-lever',
        'pro-back-lever',
        'pro-human-flag'
      ],
      minCompletions: 5
    }
  }
]

// ==================== MILESTONE ACHIEVEMENTS ====================

export const milestoneAchievements = [
  {
    id: 'calisthenics-recruit',
    title: 'The Calisthenics Recruit',
    description: 'Complete your first 5 missions',
    icon: '🎖️',
    rarity: 'common',
    condition: {
      totalMissionsCompleted: 5
    },
    xpBonus: 0,
    badge: null
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete 7 consecutive days of missions',
    icon: '🗓️',
    rarity: 'rare',
    condition: {
      consecutiveDays: 7
    },
    xpBonus: 50,
    badge: 'week-warrior-badge'
  },
  {
    id: 'gravity-apprentice',
    title: 'Gravity Apprentice',
    description: 'Reach Intermediate level (1500 XP)',
    icon: '📚',
    rarity: 'rare',
    condition: {
      minXP: 1500,
      minMissionLevel: missionLevels.INTERMEDIATE
    },
    xpBonus: 100,
    badge: 'gravity-apprentice-badge'
  },
  {
    id: 'kinetic-architect',
    title: 'Kinetic Architect',
    description: 'Reach Pro level (3000 XP)',
    icon: '🏗️',
    rarity: 'epic',
    condition: {
      minXP: 3000,
      minMissionLevel: missionLevels.PRO
    },
    xpBonus: 200,
    badge: 'kinetic-architect-badge'
  },
  {
    id: 'sovereign-steel',
    title: 'Sovereign of Steel',
    description: 'Complete all missions in a level',
    icon: '⚔️',
    rarity: 'epic',
    condition: {
      completedAllInLevel: true
    },
    xpBonus: 150,
    badge: 'sovereign-steel-badge'
  },
  {
    id: 'legendary-athlete',
    title: 'Legendary Athlete',
    description: 'Maintain 28 consecutive days of all missions',
    icon: '👑',
    rarity: 'legendary',
    condition: {
      consecutiveDays: 28,
      allMissionsDaily: true
    },
    xpBonus: 500,
    badge: 'legendary-athlete-badge'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Achieve 100-day workout streak',
    icon: '🔥',
    rarity: 'legendary',
    condition: {
      consecutiveDays: 100
    },
    xpBonus: 1000,
    badge: 'streak-master-badge'
  }
]

// ==================== HELPER FUNCTIONS ====================

/**
 * Get missions for a specific level
 */
export const getMissionsForLevel = (level) => {
  return categorizedMissions[level]?.missions || []
}

/**
 * Get all missions across all levels
 */
export const getAllMissions = () => {
  return Object.values(categorizedMissions).reduce((acc, levelData) => {
    return [...acc, ...levelData.missions]
  }, [])
}

/**
 * Get mission level based on XP
 */
export const getLevelFromXP = (xp) => {
  const levels = Object.values(levelDetails).sort((a, b) => b.minXP - a.minXP)
  
  for (const level of levels) {
    if (xp >= level.minXP) {
      // Find the key for this level
      return Object.keys(levelDetails).find(key => levelDetails[key] === level)
    }
  }
  
  return missionLevels.BEGINNER
}

/**
 * Check if mission prerequisites are met
 */
export const checkPrerequisitesMet = (mission, userProgress) => {
  if (!mission.prerequisites || mission.prerequisites.length === 0) {
    return true
  }
  
  return mission.prerequisites.every(prerequisite => {
    const completedMissions = userProgress.completedMissions.filter(
      m => m.missionId === prerequisite.missionId
    )
    return completedMissions.length >= (prerequisite.minCompletions || 1)
  })
}

/**
 * Get locked missions for a level
 */
export const getLockedMissionsForLevel = (level, userProgress) => {
  const missions = getMissionsForLevel(level)
  return missions.filter(mission => !checkPrerequisitesMet(mission, userProgress))
}

/**
 * Get available missions for a level
 */
export const getAvailableMissionsForLevel = (level, userProgress) => {
  const missions = getMissionsForLevel(level)
  return missions.filter(mission => checkPrerequisitesMet(mission, userProgress))
}

/**
 * Calculate progress towards a milestone
 */
export const getMilestoneProgress = (milestone, userProgress) => {
  const condition = milestone.condition
  let progress = 0
  let total = 1

  if (condition.totalMissionsCompleted) {
    progress = Math.min(userProgress.totalMissionsCompleted, condition.totalMissionsCompleted)
    total = condition.totalMissionsCompleted
  } else if (condition.consecutiveDays) {
    progress = Math.min(userProgress.currentStreak, condition.consecutiveDays)
    total = condition.consecutiveDays
  } else if (condition.minXP) {
    progress = Math.min(userProgress.xp, condition.minXP)
    total = condition.minXP
  }

  return {
    progress,
    total,
    percentage: Math.floor((progress / total) * 100),
    completed: progress >= total
  }
}
