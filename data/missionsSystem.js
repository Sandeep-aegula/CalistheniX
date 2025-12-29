// Comprehensive Mission System with Levels, Badges, and Achievements
// Organized by difficulty progression from Beginner to Pro

export const missionLevels = {
  BEGINNER: 'beginner',
  FAT_BURN: 'fat-burn',
  INTERMEDIATE: 'intermediate',
  PRO: 'pro'
}

// All missions organized by level with prerequisites
export const allMissions = [
  // ======================== BEGINNER LEVEL: THE FOUNDATION ========================
  {
    id: 'pull-foundation-tuesday',
    title: 'Pull Foundation Tuesday',
    description: 'Build foundational pulling strength through pull-ups and dead hangs',
    level: 'beginner',
    emoji: '📊',
    day: 'Tuesday',
    category: 'pull',
    difficulty: 1,
    skills: ['Pull-up', 'Dead Hang'],
    requirements: [
      { skillName: 'Pull-up', targetValue: 5, unit: 'reps' },
      { skillName: 'Dead Hang', targetValue: 30, unit: 'seconds' }
    ],
    xpReward: 25,
    badgeReward: 'pull-foundation',
    prerequisites: []
  },
  {
    id: 'core-foundation-wednesday',
    title: 'Core Foundation Wednesday',
    description: 'Strengthen your core with basic static holds',
    level: 'beginner',
    emoji: '💪',
    day: 'Wednesday',
    category: 'core',
    difficulty: 1,
    skills: ['Plank', 'Hollow Body Hold'],
    requirements: [
      { skillName: 'Plank', targetValue: 30, unit: 'seconds' },
      { skillName: 'Hollow Body Hold', targetValue: 20, unit: 'seconds' }
    ],
    xpReward: 25,
    badgeReward: 'core-foundation',
    prerequisites: []
  },
  {
    id: 'legs-foundation-thursday',
    title: 'Legs Foundation Thursday',
    description: 'Build lower body strength foundation',
    level: 'beginner',
    emoji: '🦵',
    day: 'Thursday',
    category: 'legs',
    difficulty: 1,
    skills: ['Squats', 'Jump Squats'],
    requirements: [
      { skillName: 'Squats', targetValue: 15, unit: 'reps' },
      { skillName: 'Jump Squats', targetValue: 10, unit: 'reps' }
    ],
    xpReward: 25,
    badgeReward: 'legs-foundation',
    prerequisites: []
  },
  {
    id: 'full-body-friday',
    title: 'Full Body Friday',
    description: 'Complete full body workout combining all movement patterns',
    level: 'beginner',
    emoji: '🔥',
    day: 'Friday',
    category: 'combination',
    difficulty: 2,
    skills: ['Push-up', 'Dead Hang', 'Squats'],
    requirements: [
      { skillName: 'Push-up', targetValue: 10, unit: 'reps' },
      { skillName: 'Dead Hang', targetValue: 20, unit: 'seconds' },
      { skillName: 'Squats', targetValue: 15, unit: 'reps' }
    ],
    xpReward: 30,
    badgeReward: 'full-body-foundation',
    prerequisites: []
  },
  {
    id: 'sunday-mobility',
    title: 'Sunday Mobility',
    description: 'Active recovery with mobility work',
    level: 'beginner',
    emoji: '🌅',
    day: 'Sunday',
    category: 'core',
    difficulty: 1,
    skills: ['Hollow Body Hold'],
    requirements: [
      { skillName: 'Hollow Body Hold', targetValue: 40, unit: 'seconds' }
    ],
    xpReward: 20,
    badgeReward: 'mobility-master',
    prerequisites: []
  },

  // ======================== FAT BURN LEVEL: THE METABOLIC ENGINE ========================
  {
    id: 'saturday-endurance',
    title: 'Saturday Endurance',
    description: 'High volume cardiovascular workout',
    level: 'fat-burn',
    emoji: '⚡',
    day: 'Saturday',
    category: 'endurance',
    difficulty: 5,
    skills: ['Push-up', 'Burpees'],
    requirements: [
      { skillName: 'Push-up', targetValue: 50, unit: 'reps' },
      { skillName: 'Burpees', targetValue: 20, unit: 'reps' }
    ],
    xpReward: 50,
    badgeReward: 'endurance-machine',
    prerequisites: [
      { missionId: 'full-body-friday', minCompletions: 3 }
    ]
  },
  {
    id: 'saturday-explosive',
    title: 'Saturday Explosive',
    description: 'Explosive power development',
    level: 'fat-burn',
    emoji: '💥',
    day: 'Saturday',
    category: 'legs',
    difficulty: 4,
    skills: ['Jump Squats'],
    requirements: [
      { skillName: 'Jump Squats', targetValue: 25, unit: 'reps' }
    ],
    xpReward: 40,
    badgeReward: 'explosive-power',
    prerequisites: [
      { missionId: 'legs-foundation-thursday', minCompletions: 2 }
    ]
  },
  {
    id: 'combination-friday',
    title: 'Combination Friday',
    description: 'Complex movement combinations',
    level: 'fat-burn',
    emoji: '🎯',
    day: 'Friday',
    category: 'combination',
    difficulty: 5,
    skills: ['Burpees', 'Handstand'],
    requirements: [
      { skillName: 'Burpees', targetValue: 15, unit: 'reps' },
      { skillName: 'Handstand', targetValue: 20, unit: 'seconds' }
    ],
    xpReward: 45,
    badgeReward: 'combo-master',
    prerequisites: []
  },
  {
    id: 'century-pusher',
    title: 'Century Pusher',
    description: 'Monthly challenge - 100 push-ups total',
    level: 'fat-burn',
    emoji: '💯',
    day: 'Monthly',
    category: 'push',
    difficulty: 5,
    skills: ['Push-up'],
    requirements: [
      { skillName: 'Push-up', targetValue: 100, unit: 'reps' }
    ],
    xpReward: 75,
    badgeReward: 'century-achiever',
    prerequisites: []
  },

  // ======================== INTERMEDIATE LEVEL: THE PROGRESSION ========================
  {
    id: 'push-progression-monday',
    title: 'Push Progression Monday',
    description: 'Master advanced pushing variations',
    level: 'intermediate',
    emoji: '📈',
    day: 'Monday',
    category: 'push',
    difficulty: 4,
    skills: ['Pike Push-up'],
    requirements: [
      { skillName: 'Pike Push-up', targetValue: 8, unit: 'reps' }
    ],
    xpReward: 40,
    badgeReward: 'push-progression',
    prerequisites: [
      { missionId: 'full-body-friday', minCompletions: 5 }
    ]
  },
  {
    id: 'pull-progression-tuesday',
    title: 'Pull Progression Tuesday',
    description: 'Advance your pulling strength',
    level: 'intermediate',
    emoji: '⬆️',
    day: 'Tuesday',
    category: 'pull',
    difficulty: 4,
    skills: ['Chin-up'],
    requirements: [
      { skillName: 'Chin-up', targetValue: 8, unit: 'reps' }
    ],
    xpReward: 40,
    badgeReward: 'pull-progression',
    prerequisites: [
      { missionId: 'pull-foundation-tuesday', minCompletions: 5 }
    ]
  },
  {
    id: 'legs-progression-thursday',
    title: 'Legs Progression Thursday',
    description: 'Single-leg strength development',
    level: 'intermediate',
    emoji: '🏃',
    day: 'Thursday',
    category: 'legs',
    difficulty: 5,
    skills: ['Pistol Squat'],
    requirements: [
      { skillName: 'Pistol Squat', targetValue: 3, unit: 'reps' }
    ],
    xpReward: 45,
    badgeReward: 'legs-progression',
    prerequisites: [
      { missionId: 'legs-foundation-thursday', minCompletions: 5 }
    ]
  },
  {
    id: 'advanced-core-wednesday',
    title: 'Advanced Core Wednesday',
    description: 'Master leverage static holds',
    level: 'intermediate',
    emoji: '🎪',
    day: 'Wednesday',
    category: 'core',
    difficulty: 6,
    skills: ['L-sit', 'V-sit'],
    requirements: [
      { skillName: 'L-sit', targetValue: 15, unit: 'seconds' },
      { skillName: 'V-sit', targetValue: 10, unit: 'seconds' }
    ],
    xpReward: 50,
    badgeReward: 'core-master',
    prerequisites: [
      { missionId: 'core-foundation-wednesday', minCompletions: 5 }
    ]
  },
  {
    id: 'sunday-leverage',
    title: 'Sunday Leverage',
    description: 'Build handstand strength and control',
    level: 'intermediate',
    emoji: '🤸',
    day: 'Sunday',
    category: 'leverage',
    difficulty: 5,
    skills: ['Handstand'],
    requirements: [
      { skillName: 'Handstand', targetValue: 60, unit: 'seconds' }
    ],
    xpReward: 45,
    badgeReward: 'leverage-specialist',
    prerequisites: []
  },
  {
    id: 'one-arm-push-monday',
    title: 'One Arm Push Monday',
    description: 'Advanced unilateral pushing',
    level: 'intermediate',
    emoji: '💪',
    day: 'Monday',
    category: 'push',
    difficulty: 7,
    skills: ['Diamond Push-up'],
    requirements: [
      { skillName: 'Diamond Push-up', targetValue: 5, unit: 'reps' }
    ],
    xpReward: 55,
    badgeReward: 'unilateral-push',
    prerequisites: [
      { missionId: 'push-progression-monday', minCompletions: 5 }
    ]
  },

  // ======================== PRO LEVEL: THE MASTERY ========================
  {
    id: 'archer-pull-monday',
    title: 'Archer Pull Monday',
    description: 'Advanced single-arm pull-up progression',
    level: 'pro',
    emoji: '🏹',
    day: 'Monday',
    category: 'pull',
    difficulty: 8,
    skills: ['Archer Pull-up'],
    requirements: [
      { skillName: 'Archer Pull-up', targetValue: 5, unit: 'reps' }
    ],
    xpReward: 75,
    badgeReward: 'archer-master',
    prerequisites: [
      { missionId: 'pull-progression-tuesday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Complete Pull Progression Tuesday 5 times first'
  },
  {
    id: 'front-lever-wednesday',
    title: 'Front Lever Wednesday',
    description: 'Master the front lever hold',
    level: 'pro',
    emoji: '⚖️',
    day: 'Wednesday',
    category: 'leverage',
    difficulty: 9,
    skills: ['Front Lever'],
    requirements: [
      { skillName: 'Front Lever', targetValue: 10, unit: 'seconds' }
    ],
    xpReward: 100,
    badgeReward: 'front-lever-master',
    prerequisites: [
      { missionId: 'advanced-core-wednesday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Unlock by completing Advanced Core Wednesday 5 times'
  },
  {
    id: 'shrimp-squat-thursday',
    title: 'Shrimp Squat Thursday',
    description: 'Master advanced single-leg squat',
    level: 'pro',
    emoji: '🦐',
    day: 'Thursday',
    category: 'legs',
    difficulty: 8,
    skills: ['Shrimp Squat'],
    requirements: [
      { skillName: 'Shrimp Squat', targetValue: 5, unit: 'reps' }
    ],
    xpReward: 75,
    badgeReward: 'shrimp-master',
    prerequisites: [
      { missionId: 'legs-progression-thursday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Complete Legs Progression Thursday 5 times first'
  },
  {
    id: 'ultimate-combo-friday',
    title: 'Ultimate Combo Friday',
    description: 'Master the muscle-up',
    level: 'pro',
    emoji: '🎖️',
    day: 'Friday',
    category: 'combination',
    difficulty: 9,
    skills: ['Muscle-up'],
    requirements: [
      { skillName: 'Muscle-up', targetValue: 3, unit: 'reps' }
    ],
    xpReward: 100,
    badgeReward: 'muscle-up-master',
    prerequisites: [
      { missionId: 'pull-progression-tuesday', minCompletions: 5 },
      { missionId: 'push-progression-monday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Complete both Pull and Push Progression 5 times each'
  },
  {
    id: 'back-lever-saturday',
    title: 'Saturday Back Lever',
    description: 'Master the back lever hold',
    level: 'pro',
    emoji: '🔙',
    day: 'Saturday',
    category: 'leverage',
    difficulty: 9,
    skills: ['Back Lever'],
    requirements: [
      { skillName: 'Back Lever', targetValue: 10, unit: 'seconds' }
    ],
    xpReward: 100,
    badgeReward: 'back-lever-master',
    prerequisites: [
      { missionId: 'advanced-core-wednesday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Unlock by completing Advanced Core Wednesday 5 times'
  },
  {
    id: 'flag-progression-sunday',
    title: 'Sunday Flag Progression',
    description: 'Master the human flag',
    level: 'pro',
    emoji: '🚩',
    day: 'Sunday',
    category: 'leverage',
    difficulty: 10,
    skills: ['Human Flag'],
    requirements: [
      { skillName: 'Human Flag', targetValue: 15, unit: 'seconds' }
    ],
    xpReward: 125,
    badgeReward: 'flag-master',
    prerequisites: [
      { missionId: 'sunday-leverage', minCompletions: 5 },
      { missionId: 'advanced-core-wednesday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Complete both Sunday Leverage and Advanced Core 5 times'
  },
  {
    id: 'one-arm-pull-tuesday',
    title: 'One Arm Pull Tuesday',
    description: 'Master the one-arm pull-up',
    level: 'pro',
    emoji: '☝️',
    day: 'Tuesday',
    category: 'pull',
    difficulty: 10,
    skills: ['One Arm Pull-up'],
    requirements: [
      { skillName: 'One Arm Pull-up', targetValue: 3, unit: 'reps' }
    ],
    xpReward: 125,
    badgeReward: 'one-arm-pull-master',
    prerequisites: [
      { missionId: 'archer-pull-monday', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Complete Archer Pull Monday 5 times first'
  },
  {
    id: 'handstand-pushup-friday',
    title: 'Ultimate Test Friday',
    description: 'Master the handstand push-up',
    level: 'pro',
    emoji: '🏆',
    day: 'Friday',
    category: 'push',
    difficulty: 9,
    skills: ['Handstand Push-up'],
    requirements: [
      { skillName: 'Handstand Push-up', targetValue: 5, unit: 'reps' }
    ],
    xpReward: 100,
    badgeReward: 'handstand-pushup-master',
    prerequisites: [
      { missionId: 'push-progression-monday', minCompletions: 5 },
      { missionId: 'sunday-leverage', minCompletions: 5 }
    ],
    isLocked: true,
    lockReason: 'Complete Push Progression and Sunday Leverage 5 times each'
  }
]

// Skill Badges - Category-specific achievements
export const skillBadges = [
  {
    id: 'hydraulic-press',
    name: 'Hydraulic Press',
    category: 'push',
    icon: '🔨',
    description: 'Master all push-up variations',
    requirements: {
      completedMissions: ['full-body-friday', 'push-progression-monday'],
      minCompletions: 5
    },
    rarity: 'epic'
  },
  {
    id: 'iron-anchor',
    name: 'Iron Anchor',
    category: 'pull',
    icon: '⚓',
    description: 'Master all pulling movements',
    requirements: {
      completedMissions: ['pull-foundation-tuesday', 'pull-progression-tuesday'],
      minCompletions: 5
    },
    rarity: 'epic'
  },
  {
    id: 'midsection-monk',
    name: 'Midsection Monk',
    category: 'core',
    icon: '🧘',
    description: 'Master core control and stability',
    requirements: {
      completedMissions: ['core-foundation-wednesday', 'advanced-core-wednesday'],
      minCompletions: 5
    },
    rarity: 'epic'
  },
  {
    id: 'piston-power',
    name: 'Piston Power',
    category: 'legs',
    icon: '⚙️',
    description: 'Master lower body strength',
    requirements: {
      completedMissions: ['legs-foundation-thursday', 'legs-progression-thursday'],
      minCompletions: 5
    },
    rarity: 'epic'
  },
  {
    id: 'total-kinetic',
    name: 'Total Kinetic',
    category: 'combination',
    icon: '⚡',
    description: 'Master complex movement combinations',
    requirements: {
      completedMissions: ['full-body-friday', 'combination-friday'],
      minCompletions: 5
    },
    rarity: 'legendary'
  },
  {
    id: 'eternal-battery',
    name: 'Eternal Battery',
    category: 'endurance',
    icon: '🔋',
    description: 'Master high-volume cardiovascular work',
    requirements: {
      completedMissions: ['saturday-endurance'],
      minCompletions: 10
    },
    rarity: 'epic'
  },
  {
    id: 'gravity-defier',
    name: 'Gravity Defier',
    category: 'leverage',
    icon: '🌌',
    description: 'Master static leverage holds',
    requirements: {
      completedMissions: ['sunday-leverage', 'advanced-core-wednesday'],
      minCompletions: 5
    },
    rarity: 'legendary'
  }
]

// Milestone Achievements - Overall rank system
export const milestoneAchievements = [
  {
    id: 'calisthenics-recruit',
    title: 'The Calisthenics Recruit',
    description: 'Your journey begins',
    tier: 'novice',
    icon: '🌱',
    requirements: {
      totalWorkouts: 1,
      xp: 0
    },
    xpBonus: 0,
    rarity: 'common'
  },
  {
    id: 'gravity-apprentice',
    title: 'Gravity Apprentice',
    description: 'You understand the basics',
    tier: 'intermediate',
    icon: '📚',
    requirements: {
      totalWorkouts: 10,
      xp: 250,
      completedLevels: ['beginner']
    },
    xpBonus: 100,
    rarity: 'rare'
  },
  {
    id: 'kinetic-architect',
    title: 'Kinetic Architect',
    description: 'You can design your own routines',
    tier: 'advanced',
    icon: '🏗️',
    requirements: {
      totalWorkouts: 25,
      xp: 750,
      completedLevels: ['beginner', 'fat-burn', 'intermediate']
    },
    xpBonus: 250,
    rarity: 'epic'
  },
  {
    id: 'sovereign-of-steel',
    title: 'Sovereign of Steel',
    description: 'You have mastered strength',
    tier: 'pro',
    icon: '👑',
    requirements: {
      totalWorkouts: 50,
      xp: 1500,
      completedLevels: ['beginner', 'fat-burn', 'intermediate', 'pro'],
      skillBadges: 5
    },
    xpBonus: 500,
    rarity: 'epic'
  },
  {
    id: 'legendary-athlete',
    title: 'Legendary Athlete',
    description: 'You are unstoppable - 28 consecutive days of all missions',
    tier: 'mastery',
    icon: '⭐',
    requirements: {
      totalWorkouts: 100,
      consecutiveDays: 28,
      xp: 3000,
      skillBadges: 7
    },
    xpBonus: 1000,
    rarity: 'legendary'
  }
]

// Experience calculation
export const xpMultipliers = {
  beginner: 1.0,
  'fat-burn': 1.2,
  intermediate: 1.5,
  pro: 2.0
}

// Difficulty scaling
export const difficultyDescriptions = {
  1: 'Beginner - Foundation Building',
  2: 'Easy - Basic Progression',
  3: 'Moderate - Solid Skills',
  4: 'Intermediate - Gaining Momentum',
  5: 'Challenging - Real Challenge',
  6: 'Hard - Test Your Limits',
  7: 'Very Hard - Advanced Athlete',
  8: 'Elite - Expert Level',
  9: 'Expert - Master Tier',
  10: 'Legendary - Pinnacle Achievement'
}
