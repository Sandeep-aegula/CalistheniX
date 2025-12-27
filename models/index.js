import mongoose from 'mongoose'

// Skill Schema - Individual calisthenics moves
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['push', 'pull', 'core', 'legs', 'combination']
  },
  difficulty: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10
  },
  prerequisites: [{ type: String }], // Array of skill names required first
  xpReward: { type: Number, required: true },
  description: { type: String },
  instructions: { type: String },
  targetReps: { type: Number, default: 1 },
  targetSets: { type: Number, default: 1 }
}, {
  timestamps: true
})

// Mission Schema - Daily/Weekly challenges
const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'special']
  },
  category: { 
    type: String, 
    required: true,
    enum: ['strength', 'endurance', 'skill', 'consistency', 'challenge']
  },
  requirements: [{
    skillName: String,
    targetValue: Number,
    unit: { type: String, enum: ['reps', 'sets', 'seconds', 'minutes'] }
  }],
  xpReward: { type: Number, required: true },
  badgeReward: { type: String }, // Optional badge for completion
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date
}, {
  timestamps: true
})

// Badge Schema - Achievements system
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // Icon identifier
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary']
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed // Flexible requirements object
  }
}, {
  timestamps: true
})

const userSchema = new mongoose.Schema({
  // Basic Info
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  password: { type: String }, // For credentials auth
  
  // Password Reset
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  
  // Gamification Stats
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalWorkouts: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  
  // Unlocked Content
  unlockedSkills: [{ 
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    unlockedAt: { type: Date, default: Date.now },
    masteryLevel: { type: Number, default: 1 }, // 1-5 stars
    bestPerformance: {
      reps: { type: Number, default: 0 },
      sets: { type: Number, default: 0 },
      duration: { type: Number, default: 0 } // in seconds
    }
  }],
  
  badges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now }
  }],
  
  // Progress Tracking
  bodyWeight: [{
    weight: Number,
    unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    date: { type: Date, default: Date.now }
  }],
  
  // Mission Progress
  activeMissions: [{
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    progress: [{
      skillName: String,
      currentValue: { type: Number, default: 0 },
      targetValue: Number,
      completed: { type: Boolean, default: false }
    }],
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    isCompleted: { type: Boolean, default: false }
  }],
  
  completedMissions: [{
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    completedAt: { type: Date, default: Date.now },
    xpEarned: Number
  }],
  
  // Workout History
  workoutSessions: [{
    date: { type: Date, default: Date.now },
    skills: [{
      skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
      sets: [{
        reps: Number,
        duration: Number, // for holds like L-sit
        restTime: Number
      }]
    }],
    totalDuration: Number, // in minutes
    xpEarned: { type: Number, default: 0 },
    caloriesBurned: Number
  }],
  
  // User Preferences
  preferences: {
    units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    notifications: {
      workoutReminders: { type: Boolean, default: true },
      missionUpdates: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showProgress: { type: Boolean, default: true }
    }
  },
  
  // Timestamps
  lastWorkout: Date,
  joinedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Indexes for better performance
skillSchema.index({ category: 1 })
skillSchema.index({ difficulty: 1 })

missionSchema.index({ type: 1, isActive: 1 })
missionSchema.index({ endDate: 1 })

badgeSchema.index({ rarity: 1 })

// Virtual for XP needed for next level
userSchema.virtual('xpToNextLevel').get(function() {
  const baseXP = 100
  const nextLevelXP = baseXP * Math.pow(1.5, this.level)
  const currentLevelXP = baseXP * Math.pow(1.5, this.level - 1)
  return Math.floor(nextLevelXP - (this.xp - currentLevelXP))
})

// Virtual for current level progress percentage
userSchema.virtual('levelProgress').get(function() {
  const baseXP = 100
  const currentLevelXP = baseXP * Math.pow(1.5, this.level - 1)
  const nextLevelXP = baseXP * Math.pow(1.5, this.level)
  const progressXP = this.xp - currentLevelXP
  const levelXPRange = nextLevelXP - currentLevelXP
  return Math.floor((progressXP / levelXPRange) * 100)
})

// Pre-save middleware to calculate level based on XP
userSchema.pre('save', function() {
  if (this.isModified('xp')) {
    const baseXP = 100
    let level = 1
    let totalXPNeeded = 0
    
    while (totalXPNeeded <= this.xp) {
      totalXPNeeded += baseXP * Math.pow(1.5, level - 1)
      if (totalXPNeeded <= this.xp) {
        level++
      }
    }
    
    this.level = level
  }
})

// Export models
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema)
export const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema)
export const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema)