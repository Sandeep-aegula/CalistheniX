// Mission Calendar Display Component
// Use this to show the week-by-week missions in the dashboard

export const weeklyMissionCalendar = {
  week1: {
    title: "🌱 Week 1: Foundation Week",
    description: "Master basic movements in all categories",
    color: "from-blue-500 to-blue-600",
    days: [
      {
        day: "Monday",
        mission: "Push Foundation",
        skills: ["Push-up (20 reps)", "Diamond Push-up (10 reps)"],
        xp: 60,
        emoji: "💪"
      },
      {
        day: "Tuesday",
        mission: "Pull Foundation",
        skills: ["Dead Hang (90 sec)", "Pull-up (8 reps)"],
        xp: 60,
        emoji: "🔥"
      },
      {
        day: "Wednesday",
        mission: "Core Foundation",
        skills: ["Plank (90 sec)", "Hollow Body Hold (60 sec)"],
        xp: 55,
        emoji: "💎"
      },
      {
        day: "Thursday",
        mission: "Legs Foundation",
        skills: ["Squat (25 reps)", "Jump Squat (15 reps)"],
        xp: 60,
        emoji: "🦵"
      },
      {
        day: "Friday",
        mission: "Full Body",
        skills: ["Push-up (15 reps)", "Dead Hang (60 sec)", "Squat (20 reps)"],
        xp: 80,
        emoji: "🌟"
      },
      {
        day: "Saturday",
        mission: "Pull Challenge",
        skills: ["Chin-up (10 reps)"],
        xp: 50,
        emoji: "🎯"
      },
      {
        day: "Sunday",
        mission: "Mobility",
        skills: ["Hollow Body Hold (45 sec)"],
        xp: 30,
        emoji: "🧘"
      }
    ],
    totalXp: 395,
    skillsIntroduced: ["Push-up", "Diamond Push-up", "Dead Hang", "Pull-up", "Chin-up", "Plank", "Hollow Body Hold", "Squat", "Jump Squat"]
  },

  week2: {
    title: "📈 Week 2: Progression Week",
    description: "Increase volume and introduce intermediate variations",
    color: "from-purple-500 to-purple-600",
    days: [
      {
        day: "Monday",
        mission: "Push Progression",
        skills: ["Push-up (25 reps)", "Pike Push-up (12 reps)"],
        xp: 70,
        emoji: "💪"
      },
      {
        day: "Tuesday",
        mission: "Pull Progression",
        skills: ["Pull-up (12 reps)", "Chin-up (15 reps)"],
        xp: 75,
        emoji: "🔥"
      },
      {
        day: "Wednesday",
        mission: "Advanced Core",
        skills: ["L-sit (20 sec)", "V-sit (30 sec)"],
        xp: 75,
        emoji: "💎"
      },
      {
        day: "Thursday",
        mission: "Legs Progression",
        skills: ["Jump Squat (20 reps)", "Pistol Squat (6 reps)"],
        xp: 75,
        emoji: "🦵"
      },
      {
        day: "Friday",
        mission: "Combination Moves",
        skills: ["Burpee (15 reps)", "Handstand (45 sec)"],
        xp: 90,
        emoji: "🌟"
      },
      {
        day: "Saturday",
        mission: "Explosive Training",
        skills: ["Jump Squat (25 reps)"],
        xp: 60,
        emoji: "⚡"
      },
      {
        day: "Sunday",
        mission: "Leverage Work",
        skills: ["Handstand (60 sec)"],
        xp: 50,
        emoji: "🎯"
      }
    ],
    totalXp: 495,
    skillsIntroduced: ["Pike Push-up", "L-sit", "V-sit", "Pistol Squat", "Burpee", "Handstand"],
    cumulativeXp: 890
  },

  week3: {
    title: "🚀 Week 3: Advanced Week",
    description: "Master advanced variations and leverage skills",
    color: "from-pink-500 to-pink-600",
    days: [
      {
        day: "Monday",
        mission: "Archer Pull",
        skills: ["Pull-up (15 reps)", "Archer Pull-up (8 reps)"],
        xp: 85,
        emoji: "🎯"
      },
      {
        day: "Tuesday",
        mission: "Handstand Push",
        skills: ["Pike Push-up (15 reps)", "Handstand (90 sec)"],
        xp: 95,
        emoji: "💪"
      },
      {
        day: "Wednesday",
        mission: "Front Lever",
        skills: ["Pull-up (12 reps)", "Front Lever (15 sec)"],
        xp: 90,
        emoji: "🔥"
      },
      {
        day: "Thursday",
        mission: "Shrimp Squat",
        skills: ["Pistol Squat (8 reps)", "Shrimp Squat (5 reps)"],
        xp: 95,
        emoji: "🦵"
      },
      {
        day: "Friday",
        mission: "Ultimate Combo",
        skills: ["Muscle-up (5 reps)", "Front Lever (20 sec)"],
        xp: 120,
        emoji: "🌟"
      },
      {
        day: "Saturday",
        mission: "Back Lever Work",
        skills: ["Back Lever (15 sec)"],
        xp: 85,
        emoji: "💎"
      },
      {
        day: "Sunday",
        mission: "Flag Progression",
        skills: ["Human Flag (10 sec)"],
        xp: 100,
        emoji: "🎯"
      }
    ],
    totalXp: 670,
    skillsIntroduced: ["Archer Pull-up", "Front Lever", "Shrimp Squat", "Muscle-up", "Back Lever", "Human Flag"],
    cumulativeXp: 1560
  },

  week4: {
    title: "🏆 Week 4: Mastery Week",
    description: "Achieve mastery in all skill categories",
    color: "from-yellow-500 to-yellow-600",
    days: [
      {
        day: "Monday",
        mission: "One Arm Push",
        skills: ["Diamond Push-up (15 reps)", "One Arm Push-up (3 reps)"],
        xp: 100,
        emoji: "💪"
      },
      {
        day: "Tuesday",
        mission: "One Arm Pull",
        skills: ["Archer Pull-up (10 reps)", "One Arm Pull-up (1 rep)"],
        xp: 120,
        emoji: "🔥"
      },
      {
        day: "Wednesday",
        mission: "Planche Work",
        skills: ["L-sit (30 sec)", "Human Flag (20 sec)"],
        xp: 120,
        emoji: "💎"
      },
      {
        day: "Thursday",
        mission: "Peak Legs",
        skills: ["Shrimp Squat (8 reps)", "Pistol Squat (10 reps)"],
        xp: 110,
        emoji: "🦵"
      },
      {
        day: "Friday",
        mission: "Ultimate Test",
        skills: ["Handstand Push-up (5 reps)", "Back Lever (25 sec)"],
        xp: 150,
        emoji: "🌟"
      },
      {
        day: "Saturday",
        mission: "Full Endurance",
        skills: ["Push-up (50 reps)", "Burpee (20 reps)"],
        xp: 100,
        emoji: "⚡"
      },
      {
        day: "Sunday",
        mission: "Mastery Celebration",
        skills: ["Handstand (120 sec)", "Front Lever (30 sec)"],
        xp: 200,
        emoji: "🏆",
        badge: "Calisthenics Master"
      }
    ],
    totalXp: 800,
    skillsIntroduced: ["One Arm Push-up", "One Arm Pull-up", "Handstand Push-up"],
    cumulativeXp: 2360
  }
};

// Summary Statistics
export const calendarStats = {
  totalWeeks: 4,
  totalDailyMissions: 28,
  totalWeeklyMissions: 2,
  totalMonthlyMissions: 4,
  totalMissions: 34,
  totalSkills: 25,
  totalXp: 2360,
  skillsPerCategory: {
    push: 5,
    pull: 6,
    core: 5,
    legs: 4,
    combination: 4
  },
  totalSkillsPerCategory: 24,
  averageXpPerDay: 85,
  estimatedLevelAt4Weeks: 24
};

// Category breakdown
export const skillsByCategory = {
  push: [
    "Push-up",
    "Diamond Push-up",
    "Pike Push-up",
    "Handstand Push-up",
    "One Arm Push-up"
  ],
  pull: [
    "Dead Hang",
    "Pull-up",
    "Chin-up",
    "Archer Pull-up",
    "One Arm Pull-up",
    "Muscle-up"
  ],
  core: [
    "Plank",
    "Hollow Body Hold",
    "L-sit",
    "V-sit",
    "Human Flag"
  ],
  legs: [
    "Squat",
    "Jump Squat",
    "Pistol Squat",
    "Shrimp Squat"
  ],
  combination: [
    "Burpee",
    "Handstand",
    "Front Lever",
    "Back Lever"
  ]
};

// Progression levels
export const progressionLevels = {
  beginner: {
    level: 1,
    week: 1,
    description: "Master the fundamentals",
    xpRequired: 0,
    skillsUnlocked: 9
  },
  intermediate: {
    level: 8,
    week: 2,
    description: "Progress to harder variations",
    xpRequired: 800,
    skillsUnlocked: 15
  },
  advanced: {
    level: 15,
    week: 3,
    description: "Master complex movements",
    xpRequired: 1500,
    skillsUnlocked: 21
  },
  expert: {
    level: 23,
    week: 4,
    description: "Achieve mastery",
    xpRequired: 2300,
    skillsUnlocked: 24
  }
};
