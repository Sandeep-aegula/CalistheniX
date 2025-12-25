// Initial skill data for CalistheniX
export const initialSkills = [
  // Push Category - Upper body pushing movements
  {
    name: 'Push-up',
    category: 'push',
    difficulty: 1,
    prerequisites: [],
    xpReward: 10,
    description: 'The foundation of all pushing movements',
    instructions: 'Start in plank position, lower chest to ground, push back up',
    targetReps: 10,
    targetSets: 3
  },
  {
    name: 'Diamond Push-up',
    category: 'push',
    difficulty: 3,
    prerequisites: ['Push-up'],
    xpReward: 25,
    description: 'Advanced push-up variation targeting triceps',
    instructions: 'Form diamond shape with hands, perform push-up with narrow grip',
    targetReps: 5,
    targetSets: 3
  },
  {
    name: 'Pike Push-up',
    category: 'push',
    difficulty: 4,
    prerequisites: ['Push-up'],
    xpReward: 30,
    description: 'Shoulder-focused push-up variation',
    instructions: 'Start in downward dog, lower head towards hands, push back up',
    targetReps: 8,
    targetSets: 3
  },
  {
    name: 'Handstand Push-up',
    category: 'push',
    difficulty: 8,
    prerequisites: ['Pike Push-up', 'Handstand'],
    xpReward: 100,
    description: 'Ultimate pushing exercise - inverted push-up',
    instructions: 'In handstand position, lower head to ground, push back up',
    targetReps: 3,
    targetSets: 3
  },
  {
    name: 'One Arm Push-up',
    category: 'push',
    difficulty: 9,
    prerequisites: ['Diamond Push-up'],
    xpReward: 150,
    description: 'Single arm push-up requiring immense strength',
    instructions: 'Place one hand behind back, perform push-up with single arm',
    targetReps: 1,
    targetSets: 3
  },

  // Pull Category - Upper body pulling movements  
  {
    name: 'Dead Hang',
    category: 'pull',
    difficulty: 1,
    prerequisites: [],
    xpReward: 15,
    description: 'Basic grip strength and shoulder stability',
    instructions: 'Hang from bar with arms fully extended',
    targetReps: 30, // seconds
    targetSets: 3
  },
  {
    name: 'Pull-up',
    category: 'pull',
    difficulty: 3,
    prerequisites: ['Dead Hang'],
    xpReward: 25,
    description: 'Classic upper body pulling exercise',
    instructions: 'Hang from bar, pull chest to bar, lower with control',
    targetReps: 5,
    targetSets: 3
  },
  {
    name: 'Chin-up',
    category: 'pull',
    difficulty: 2,
    prerequisites: ['Dead Hang'],
    xpReward: 20,
    description: 'Underhand grip pull-up variation',
    instructions: 'Hang with palms facing you, pull chin over bar',
    targetReps: 8,
    targetSets: 3
  },
  {
    name: 'Archer Pull-up',
    category: 'pull',
    difficulty: 6,
    prerequisites: ['Pull-up'],
    xpReward: 60,
    description: 'Single-arm pull-up progression',
    instructions: 'Pull to one side, extend opposite arm straight',
    targetReps: 3,
    targetSets: 3
  },
  {
    name: 'One Arm Pull-up',
    category: 'pull',
    difficulty: 10,
    prerequisites: ['Archer Pull-up'],
    xpReward: 200,
    description: 'Ultimate pulling exercise',
    instructions: 'Pull up using only one arm',
    targetReps: 1,
    targetSets: 3
  },
  {
    name: 'Muscle-up',
    category: 'pull',
    difficulty: 7,
    prerequisites: ['Pull-up', 'Dip'],
    xpReward: 80,
    description: 'Explosive pull-up transitioning to dip',
    instructions: 'Pull explosively over bar, transition to support position',
    targetReps: 3,
    targetSets: 3
  },

  // Core Category - Abdominal and core strength
  {
    name: 'Plank',
    category: 'core',
    difficulty: 1,
    prerequisites: [],
    xpReward: 10,
    description: 'Isometric core strengthening hold',
    instructions: 'Hold straight line from head to feet on forearms',
    targetReps: 60, // seconds
    targetSets: 3
  },
  {
    name: 'Hollow Body Hold',
    category: 'core',
    difficulty: 2,
    prerequisites: [],
    xpReward: 15,
    description: 'Active core engagement exercise',
    instructions: 'Lie on back, press lower back down, hold hollow position',
    targetReps: 30, // seconds
    targetSets: 3
  },
  {
    name: 'L-sit',
    category: 'core',
    difficulty: 5,
    prerequisites: ['Hollow Body Hold'],
    xpReward: 50,
    description: 'Advanced core and shoulder strength hold',
    instructions: 'Sit with legs extended, lift entire body off ground with hands',
    targetReps: 10, // seconds
    targetSets: 3
  },
  {
    name: 'V-sit',
    category: 'core',
    difficulty: 4,
    prerequisites: ['Hollow Body Hold'],
    xpReward: 35,
    description: 'Dynamic core balance exercise',
    instructions: 'Balance on tailbone with legs and torso forming V shape',
    targetReps: 20, // seconds
    targetSets: 3
  },
  {
    name: 'Human Flag',
    category: 'core',
    difficulty: 10,
    prerequisites: ['L-sit', 'Side Plank'],
    xpReward: 200,
    description: 'Ultimate core strength demonstration',
    instructions: 'Hold body horizontal while gripping vertical pole',
    targetReps: 5, // seconds
    targetSets: 3
  },

  // Legs Category - Lower body strength
  {
    name: 'Squat',
    category: 'legs',
    difficulty: 1,
    prerequisites: [],
    xpReward: 10,
    description: 'Basic lower body strengthening',
    instructions: 'Lower hips back and down, keep chest up, drive through heels',
    targetReps: 15,
    targetSets: 3
  },
  {
    name: 'Jump Squat',
    category: 'legs',
    difficulty: 2,
    prerequisites: ['Squat'],
    xpReward: 15,
    description: 'Explosive squat variation',
    instructions: 'Perform squat then jump up explosively',
    targetReps: 10,
    targetSets: 3
  },
  {
    name: 'Pistol Squat',
    category: 'legs',
    difficulty: 7,
    prerequisites: ['Squat'],
    xpReward: 75,
    description: 'Single leg squat requiring balance and strength',
    instructions: 'Squat on one leg, extend other leg forward',
    targetReps: 5,
    targetSets: 3
  },
  {
    name: 'Shrimp Squat',
    category: 'legs',
    difficulty: 9,
    prerequisites: ['Pistol Squat'],
    xpReward: 125,
    description: 'Advanced single leg squat variation',
    instructions: 'Single leg squat with rear foot pulled to glute',
    targetReps: 3,
    targetSets: 3
  },

  // Combination Category - Complex multi-muscle movements
  {
    name: 'Burpee',
    category: 'combination',
    difficulty: 2,
    prerequisites: ['Push-up', 'Squat'],
    xpReward: 20,
    description: 'Full body conditioning exercise',
    instructions: 'Squat down, jump back to plank, push-up, jump forward, jump up',
    targetReps: 10,
    targetSets: 3
  },
  {
    name: 'Handstand',
    category: 'combination',
    difficulty: 6,
    prerequisites: ['Pike Push-up', 'Hollow Body Hold'],
    xpReward: 60,
    description: 'Inverted balance requiring strength and control',
    instructions: 'Kick up to vertical position, balance on hands',
    targetReps: 30, // seconds
    targetSets: 3
  },
  {
    name: 'Front Lever',
    category: 'combination',
    difficulty: 8,
    prerequisites: ['Pull-up', 'Hollow Body Hold'],
    xpReward: 100,
    description: 'Advanced horizontal hold',
    instructions: 'Hang from bar, lift body horizontal parallel to ground',
    targetReps: 5, // seconds
    targetSets: 3
  },
  {
    name: 'Back Lever',
    category: 'combination',
    difficulty: 9,
    prerequisites: ['Pull-up', 'Hollow Body Hold'],
    xpReward: 120,
    description: 'Inverted horizontal hold',
    instructions: 'From support position, lower body to horizontal behind bar',
    targetReps: 5, // seconds
    targetSets: 3
  }
]

// Initial missions for the mission system
export const initialMissions = [
  // Daily Missions
  {
    title: 'Morning Warrior',
    description: 'Complete a basic strength circuit to start your day strong',
    type: 'daily',
    category: 'strength',
    requirements: [
      { skillName: 'Push-up', targetValue: 10, unit: 'reps' },
      { skillName: 'Squat', targetValue: 15, unit: 'reps' },
      { skillName: 'Plank', targetValue: 30, unit: 'seconds' }
    ],
    xpReward: 50,
    badgeReward: null,
    isActive: true
  },
  {
    title: 'Grip Master',
    description: 'Build crushing grip strength with hanging exercises',
    type: 'daily',
    category: 'strength',
    requirements: [
      { skillName: 'Dead Hang', targetValue: 60, unit: 'seconds' }
    ],
    xpReward: 30,
    badgeReward: null,
    isActive: true
  },
  {
    title: 'Push Power',
    description: 'Focus on pushing strength and endurance',
    type: 'daily',
    category: 'strength',
    requirements: [
      { skillName: 'Push-up', targetValue: 25, unit: 'reps' },
      { skillName: 'Pike Push-up', targetValue: 8, unit: 'reps' }
    ],
    xpReward: 40,
    badgeReward: null,
    isActive: true
  },
  
  // Weekly Missions
  {
    title: 'Consistency Champion',
    description: 'Train for 5 days this week to build lasting habits',
    type: 'weekly',
    category: 'consistency',
    requirements: [
      { skillName: 'Any Workout', targetValue: 5, unit: 'sessions' }
    ],
    xpReward: 200,
    badgeReward: 'Weekly Warrior',
    isActive: true
  },
  {
    title: 'Skill Seeker',
    description: 'Practice 3 different skill categories this week',
    type: 'weekly',
    category: 'skill',
    requirements: [
      { skillName: 'Push Category', targetValue: 3, unit: 'sessions' },
      { skillName: 'Pull Category', targetValue: 3, unit: 'sessions' },
      { skillName: 'Core Category', targetValue: 3, unit: 'sessions' }
    ],
    xpReward: 150,
    badgeReward: 'Versatile Athlete',
    isActive: true
  },
  
  // Monthly Challenges
  {
    title: 'Century Club',
    description: 'Complete 100 push-ups this month (cumulative)',
    type: 'monthly',
    category: 'challenge',
    requirements: [
      { skillName: 'Push-up', targetValue: 100, unit: 'reps' }
    ],
    xpReward: 500,
    badgeReward: 'Century Pusher',
    isActive: true
  },
  {
    title: 'Iron Grip',
    description: 'Accumulate 30 minutes of dead hang time this month',
    type: 'monthly',
    category: 'challenge',
    requirements: [
      { skillName: 'Dead Hang', targetValue: 1800, unit: 'seconds' }
    ],
    xpReward: 400,
    badgeReward: 'Iron Hands',
    isActive: true
  }
]

// Initial badges for the achievement system
export const initialBadges = [
  {
    name: 'First Steps',
    description: 'Complete your first workout session',
    icon: 'trophy',
    rarity: 'common',
    requirements: { workouts: 1 }
  },
  {
    name: 'Push Pioneer',
    description: 'Unlock your first push exercise',
    icon: 'muscle',
    rarity: 'common',
    requirements: { pushSkills: 1 }
  },
  {
    name: 'Pull Master',
    description: 'Unlock your first pull exercise',
    icon: 'anchor',
    rarity: 'common',
    requirements: { pullSkills: 1 }
  },
  {
    name: 'Core Commander',
    description: 'Unlock your first core exercise',
    icon: 'shield',
    rarity: 'common',
    requirements: { coreSkills: 1 }
  },
  {
    name: 'Weekly Warrior',
    description: 'Complete all daily missions for a week',
    icon: 'calendar',
    rarity: 'rare',
    requirements: { weeklyConsistency: 7 }
  },
  {
    name: 'Versatile Athlete',
    description: 'Train in all skill categories in one week',
    icon: 'star',
    rarity: 'rare',
    requirements: { categoryDiversity: 5 }
  },
  {
    name: 'Century Pusher',
    description: 'Complete 100 push-ups in one month',
    icon: 'flame',
    rarity: 'epic',
    requirements: { monthlyPushUps: 100 }
  },
  {
    name: 'Iron Hands',
    description: 'Hang for 30 minutes cumulative in one month',
    icon: 'hand',
    rarity: 'epic',
    requirements: { monthlyHangTime: 1800 }
  },
  {
    name: 'Legendary Athlete',
    description: 'Reach level 50 in CalistheniX',
    icon: 'crown',
    rarity: 'legendary',
    requirements: { level: 50 }
  },
  {
    name: 'Master of Movement',
    description: 'Unlock all skills in the skill tree',
    icon: 'infinity',
    rarity: 'legendary',
    requirements: { allSkillsUnlocked: true }
  }
]