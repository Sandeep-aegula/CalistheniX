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

// Initial missions for the mission system - Week-by-Week Calendar
export const initialMissions = [
  // WEEK 1 - FOUNDATION WEEK
  // Monday - Push Foundation
  {
    id: 1,
    title: 'Push Foundation Monday',
    description: 'Master the basics of pushing movements',
    type: 'daily',
    category: 'strength',
    day: 'Monday',
    week: 1,
    requirements: [
      { skillName: 'Push-up', targetValue: 20, unit: 'reps' },
      { skillName: 'Diamond Push-up', targetValue: 10, unit: 'reps' }
    ],
    xpReward: 60,
    badgeReward: null,
    isActive: true
  },

  // Tuesday - Pull Foundation
  {
    id: 2,
    title: 'Pull Foundation Tuesday',
    description: 'Build your pulling strength from the ground up',
    type: 'daily',
    category: 'strength',
    day: 'Tuesday',
    week: 1,
    requirements: [
      { skillName: 'Dead Hang', targetValue: 90, unit: 'seconds' },
      { skillName: 'Pull-up', targetValue: 8, unit: 'reps' }
    ],
    xpReward: 60,
    badgeReward: null,
    isActive: true
  },

  // Wednesday - Core Foundation
  {
    id: 3,
    title: 'Core Foundation Wednesday',
    description: 'Build a strong and stable core',
    type: 'daily',
    category: 'strength',
    day: 'Wednesday',
    week: 1,
    requirements: [
      { skillName: 'Plank', targetValue: 90, unit: 'seconds' },
      { skillName: 'Hollow Body Hold', targetValue: 60, unit: 'seconds' }
    ],
    xpReward: 55,
    badgeReward: null,
    isActive: true
  },

  // Thursday - Legs Foundation
  {
    id: 4,
    title: 'Legs Foundation Thursday',
    description: 'Strengthen your lower body',
    type: 'daily',
    category: 'strength',
    day: 'Thursday',
    week: 1,
    requirements: [
      { skillName: 'Squat', targetValue: 25, unit: 'reps' },
      { skillName: 'Jump Squat', targetValue: 15, unit: 'reps' }
    ],
    xpReward: 60,
    badgeReward: null,
    isActive: true
  },

  // Friday - Full Body
  {
    id: 5,
    title: 'Full Body Friday',
    description: 'Complete full body training circuit',
    type: 'daily',
    category: 'strength',
    day: 'Friday',
    week: 1,
    requirements: [
      { skillName: 'Push-up', targetValue: 15, unit: 'reps' },
      { skillName: 'Dead Hang', targetValue: 60, unit: 'seconds' },
      { skillName: 'Squat', targetValue: 20, unit: 'reps' }
    ],
    xpReward: 80,
    badgeReward: null,
    isActive: true
  },

  // Saturday - Optional: Chin-ups + Variations
  {
    id: 6,
    title: 'Saturday Pull Challenge',
    description: 'Master different grip variations',
    type: 'daily',
    category: 'strength',
    day: 'Saturday',
    week: 1,
    requirements: [
      { skillName: 'Chin-up', targetValue: 10, unit: 'reps' }
    ],
    xpReward: 50,
    badgeReward: null,
    isActive: true
  },

  // Sunday - Recovery/Light Training
  {
    id: 7,
    title: 'Sunday Mobility',
    description: 'Light training and mobility work',
    type: 'daily',
    category: 'skill',
    day: 'Sunday',
    week: 1,
    requirements: [
      { skillName: 'Hollow Body Hold', targetValue: 45, unit: 'seconds' }
    ],
    xpReward: 30,
    badgeReward: null,
    isActive: true
  },

  // WEEK 2 - PROGRESSION WEEK
  // Monday - Push Progression
  {
    id: 8,
    title: 'Push Progression Monday',
    description: 'Progress to harder pushing variations',
    type: 'daily',
    category: 'strength',
    day: 'Monday',
    week: 2,
    requirements: [
      { skillName: 'Push-up', targetValue: 25, unit: 'reps' },
      { skillName: 'Pike Push-up', targetValue: 12, unit: 'reps' }
    ],
    xpReward: 70,
    badgeReward: null,
    isActive: true
  },

  // Tuesday - Pull Progression
  {
    id: 9,
    title: 'Pull Progression Tuesday',
    description: 'Work on pull-up variations and strength',
    type: 'daily',
    category: 'strength',
    day: 'Tuesday',
    week: 2,
    requirements: [
      { skillName: 'Pull-up', targetValue: 12, unit: 'reps' },
      { skillName: 'Chin-up', targetValue: 15, unit: 'reps' }
    ],
    xpReward: 75,
    badgeReward: null,
    isActive: true
  },

  // Wednesday - Advanced Core
  {
    id: 10,
    title: 'Advanced Core Wednesday',
    description: 'Challenge your core with advanced holds',
    type: 'daily',
    category: 'strength',
    day: 'Wednesday',
    week: 2,
    requirements: [
      { skillName: 'L-sit', targetValue: 20, unit: 'seconds' },
      { skillName: 'V-sit', targetValue: 30, unit: 'seconds' }
    ],
    xpReward: 75,
    badgeReward: null,
    isActive: true
  },

  // Thursday - Legs Progression
  {
    id: 11,
    title: 'Legs Progression Thursday',
    description: 'Single leg squat variations',
    type: 'daily',
    category: 'strength',
    day: 'Thursday',
    week: 2,
    requirements: [
      { skillName: 'Jump Squat', targetValue: 20, unit: 'reps' },
      { skillName: 'Pistol Squat', targetValue: 6, unit: 'reps' }
    ],
    xpReward: 75,
    badgeReward: null,
    isActive: true
  },

  // Friday - Combination Moves
  {
    id: 12,
    title: 'Combination Friday',
    description: 'Master complex multi-muscle movements',
    type: 'daily',
    category: 'strength',
    day: 'Friday',
    week: 2,
    requirements: [
      { skillName: 'Burpee', targetValue: 15, unit: 'reps' },
      { skillName: 'Handstand', targetValue: 45, unit: 'seconds' }
    ],
    xpReward: 90,
    badgeReward: null,
    isActive: true
  },

  // Saturday - Explosive Training
  {
    id: 13,
    title: 'Saturday Explosive',
    description: 'Focus on explosive power movements',
    type: 'daily',
    category: 'strength',
    day: 'Saturday',
    week: 2,
    requirements: [
      { skillName: 'Jump Squat', targetValue: 25, unit: 'reps' }
    ],
    xpReward: 60,
    badgeReward: null,
    isActive: true
  },

  // Sunday - Leverage Work
  {
    id: 14,
    title: 'Sunday Leverage',
    description: 'Work on leverage and balance skills',
    type: 'daily',
    category: 'skill',
    day: 'Sunday',
    week: 2,
    requirements: [
      { skillName: 'Handstand', targetValue: 60, unit: 'seconds' }
    ],
    xpReward: 50,
    badgeReward: null,
    isActive: true
  },

  // WEEK 3 - ADVANCED WEEK
  // Monday - Archer Pull-ups
  {
    id: 15,
    title: 'Archer Pull Monday',
    description: 'Master archer pull-up variations',
    type: 'daily',
    category: 'strength',
    day: 'Monday',
    week: 3,
    requirements: [
      { skillName: 'Pull-up', targetValue: 15, unit: 'reps' },
      { skillName: 'Archer Pull-up', targetValue: 8, unit: 'reps' }
    ],
    xpReward: 85,
    badgeReward: null,
    isActive: true
  },

  // Tuesday - Handstand Push
  {
    id: 16,
    title: 'Handstand Push Tuesday',
    description: 'Work towards handstand push-ups',
    type: 'daily',
    category: 'strength',
    day: 'Tuesday',
    week: 3,
    requirements: [
      { skillName: 'Pike Push-up', targetValue: 15, unit: 'reps' },
      { skillName: 'Handstand', targetValue: 90, unit: 'seconds' }
    ],
    xpReward: 95,
    badgeReward: null,
    isActive: true
  },

  // Wednesday - Front Lever
  {
    id: 17,
    title: 'Front Lever Wednesday',
    description: 'Work on front lever progressions',
    type: 'daily',
    category: 'strength',
    day: 'Wednesday',
    week: 3,
    requirements: [
      { skillName: 'Pull-up', targetValue: 12, unit: 'reps' },
      { skillName: 'Front Lever', targetValue: 15, unit: 'seconds' }
    ],
    xpReward: 90,
    badgeReward: null,
    isActive: true
  },

  // Thursday - Shrimp Squats
  {
    id: 18,
    title: 'Shrimp Squat Thursday',
    description: 'Advanced single leg squat variations',
    type: 'daily',
    category: 'strength',
    day: 'Thursday',
    week: 3,
    requirements: [
      { skillName: 'Pistol Squat', targetValue: 8, unit: 'reps' },
      { skillName: 'Shrimp Squat', targetValue: 5, unit: 'reps' }
    ],
    xpReward: 95,
    badgeReward: null,
    isActive: true
  },

  // Friday - Ultimate Combination
  {
    id: 19,
    title: 'Ultimate Combo Friday',
    description: 'Combine multiple advanced skills',
    type: 'daily',
    category: 'strength',
    day: 'Friday',
    week: 3,
    requirements: [
      { skillName: 'Muscle-up', targetValue: 5, unit: 'reps' },
      { skillName: 'Front Lever', targetValue: 20, unit: 'seconds' }
    ],
    xpReward: 120,
    badgeReward: null,
    isActive: true
  },

  // Saturday - Back Lever Work
  {
    id: 20,
    title: 'Saturday Back Lever',
    description: 'Work on back lever progressions',
    type: 'daily',
    category: 'strength',
    day: 'Saturday',
    week: 3,
    requirements: [
      { skillName: 'Back Lever', targetValue: 15, unit: 'seconds' }
    ],
    xpReward: 85,
    badgeReward: null,
    isActive: true
  },

  // Sunday - Human Flag Progression
  {
    id: 21,
    title: 'Sunday Flag Progression',
    description: 'Work towards human flag hold',
    type: 'daily',
    category: 'skill',
    day: 'Sunday',
    week: 3,
    requirements: [
      { skillName: 'Human Flag', targetValue: 10, unit: 'seconds' }
    ],
    xpReward: 100,
    badgeReward: null,
    isActive: true
  },

  // WEEK 4 - MASTERY WEEK
  // Monday - One Arm Push Progression
  {
    id: 22,
    title: 'One Arm Push Monday',
    description: 'Work towards one arm push-up',
    type: 'daily',
    category: 'strength',
    day: 'Monday',
    week: 4,
    requirements: [
      { skillName: 'Diamond Push-up', targetValue: 15, unit: 'reps' },
      { skillName: 'One Arm Push-up', targetValue: 3, unit: 'reps' }
    ],
    xpReward: 100,
    badgeReward: null,
    isActive: true
  },

  // Tuesday - One Arm Pull Progression
  {
    id: 23,
    title: 'One Arm Pull Tuesday',
    description: 'Work towards one arm pull-up',
    type: 'daily',
    category: 'strength',
    day: 'Tuesday',
    week: 4,
    requirements: [
      { skillName: 'Archer Pull-up', targetValue: 10, unit: 'reps' },
      { skillName: 'One Arm Pull-up', targetValue: 1, unit: 'reps' }
    ],
    xpReward: 120,
    badgeReward: null,
    isActive: true
  },

  // Wednesday - Planche Work
  {
    id: 24,
    title: 'Planche Wednesday',
    description: 'Master the ultimate core hold',
    type: 'daily',
    category: 'strength',
    day: 'Wednesday',
    week: 4,
    requirements: [
      { skillName: 'L-sit', targetValue: 30, unit: 'seconds' },
      { skillName: 'Human Flag', targetValue: 20, unit: 'seconds' }
    ],
    xpReward: 120,
    badgeReward: null,
    isActive: true
  },

  // Thursday - Peak Legs
  {
    id: 25,
    title: 'Peak Legs Thursday',
    description: 'Master all leg variations',
    type: 'daily',
    category: 'strength',
    day: 'Thursday',
    week: 4,
    requirements: [
      { skillName: 'Shrimp Squat', targetValue: 8, unit: 'reps' },
      { skillName: 'Pistol Squat', targetValue: 10, unit: 'reps' }
    ],
    xpReward: 110,
    badgeReward: null,
    isActive: true
  },

  // Friday - Ultimate Test Friday
  {
    id: 26,
    title: 'Ultimate Test Friday',
    description: 'Test all your advanced skills',
    type: 'daily',
    category: 'strength',
    day: 'Friday',
    week: 4,
    requirements: [
      { skillName: 'Handstand Push-up', targetValue: 5, unit: 'reps' },
      { skillName: 'Back Lever', targetValue: 25, unit: 'seconds' }
    ],
    xpReward: 150,
    badgeReward: null,
    isActive: true
  },

  // Saturday - Full Endurance
  {
    id: 27,
    title: 'Saturday Endurance',
    description: 'Complete high rep endurance challenge',
    type: 'daily',
    category: 'endurance',
    day: 'Saturday',
    week: 4,
    requirements: [
      { skillName: 'Push-up', targetValue: 50, unit: 'reps' },
      { skillName: 'Burpee', targetValue: 20, unit: 'reps' }
    ],
    xpReward: 100,
    badgeReward: null,
    isActive: true
  },

  // Sunday - Mastery Celebration
  {
    id: 28,
    title: 'Mastery Celebration Sunday',
    description: 'You have mastered calisthenics!',
    type: 'daily',
    category: 'challenge',
    day: 'Sunday',
    week: 4,
    requirements: [
      { skillName: 'Handstand', targetValue: 120, unit: 'seconds' },
      { skillName: 'Front Lever', targetValue: 30, unit: 'seconds' }
    ],
    xpReward: 200,
    badgeReward: 'Calisthenics Master',
    isActive: true
  },

  // WEEKLY CHALLENGES
  {
    id: 101,
    title: 'Week Warrior',
    description: 'Complete all daily missions for the entire week',
    type: 'weekly',
    category: 'consistency',
    week: 'any',
    requirements: [
      { skillName: 'Weekly Complete', targetValue: 7, unit: 'days' }
    ],
    xpReward: 300,
    badgeReward: 'Week Warrior',
    isActive: true
  },

  {
    id: 102,
    title: 'Diversity Master',
    description: 'Train in all 5 skill categories this week',
    type: 'weekly',
    category: 'skill',
    week: 'any',
    requirements: [
      { skillName: 'Push Category', targetValue: 1, unit: 'sessions' },
      { skillName: 'Pull Category', targetValue: 1, unit: 'sessions' },
      { skillName: 'Core Category', targetValue: 1, unit: 'sessions' },
      { skillName: 'Legs Category', targetValue: 1, unit: 'sessions' },
      { skillName: 'Combination Category', targetValue: 1, unit: 'sessions' }
    ],
    xpReward: 250,
    badgeReward: 'Versatile Athlete',
    isActive: true
  },

  // MONTHLY CHALLENGES
  {
    id: 201,
    title: 'Century Pusher',
    description: 'Complete 100 push-ups throughout the month',
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
    id: 202,
    title: 'Iron Grip Champion',
    description: 'Accumulate 30 minutes of dead hang time',
    type: 'monthly',
    category: 'challenge',
    requirements: [
      { skillName: 'Dead Hang', targetValue: 1800, unit: 'seconds' }
    ],
    xpReward: 400,
    badgeReward: 'Iron Hands',
    isActive: true
  },

  {
    id: 203,
    title: 'Core Master',
    description: 'Master all core movements this month',
    type: 'monthly',
    category: 'challenge',
    requirements: [
      { skillName: 'Plank', targetValue: 200, unit: 'seconds' },
      { skillName: 'L-sit', targetValue: 50, unit: 'seconds' },
      { skillName: 'Human Flag', targetValue: 30, unit: 'seconds' }
    ],
    xpReward: 600,
    badgeReward: 'Core Fortress',
    isActive: true
  },

  {
    id: 204,
    title: 'Legendary Athlete',
    description: 'Complete all weekly and daily challenges for 4 weeks',
    type: 'monthly',
    category: 'challenge',
    requirements: [
      { skillName: 'All Missions', targetValue: 28, unit: 'completed' }
    ],
    xpReward: 1000,
    badgeReward: 'Legendary Athlete',
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