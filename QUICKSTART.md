# 🚀 CalistheniX Mission System - Quick Start Guide

## Getting Started in 5 Minutes

### 1. **View the Mission System**
Navigate to `/missions` in your app to see the complete system in action.

```
http://localhost:3000/missions
```

This page showcases:
- All 23 missions organized by level
- 7 skill badges with unlock conditions
- 5 milestone achievements
- XP and rewards information

---

### 2. **Understanding the Structure**

#### 📊 Missions Data (`data/missionsSystem.js`)
```javascript
import { allMissions, skillBadges, milestoneAchievements } from '@/data/missionsSystem'

// All 23 missions in one array
allMissions.map(mission => {
  mission.id              // Unique identifier
  mission.title           // Mission name
  mission.level           // 'beginner', 'fat-burn', 'intermediate', 'pro'
  mission.difficulty      // 1-10 scale
  mission.xpReward        // Base XP (before multiplier)
  mission.prerequisites   // Array of required mission completions
  mission.isLocked        // Boolean - is mission locked?
  mission.lockReason      // String explaining why it's locked
})

// Calculate actual XP with multiplier
const xpMultipliers = {
  beginner: 1.0,
  'fat-burn': 1.2,
  intermediate: 1.5,
  pro: 2.0
}

const actualXP = mission.xpReward * xpMultipliers[mission.level]
```

---

### 3. **Using the Mission Hook**

#### Basic Usage
```javascript
'use client'
import { useMissionSystem } from '@/hooks/useMissionSystem'

export default function MyComponent() {
  const userId = 'user_123' // From session
  const {
    userProgress,
    completeMission,
    getAvailableMissions
  } = useMissionSystem(userId)

  if (!userProgress) return <p>Loading...</p>

  return (
    <div>
      <p>Total Workouts: {userProgress.totalWorkouts}</p>
      <p>Total XP: {userProgress.totalXP}</p>
    </div>
  )
}
```

#### Complete a Mission
```javascript
const handleMissionClick = async (missionId) => {
  try {
    const result = await completeMission(missionId)
    console.log(`Mission completed!`)
    console.log(`XP Earned: ${result.xpGained}`)
    console.log(`New Badges: ${result.newBadges.length}`)
    console.log(`New Milestones: ${result.newMilestones.length}`)
  } catch (error) {
    console.error('Failed to complete mission:', error)
  }
}
```

#### Get Missions by Level
```javascript
const { getMissionsByLevel, getAvailableMissions } = useMissionSystem(userId)

// Get all beginner missions
const beginnerMissions = getMissionsByLevel('beginner')

// Get only unlocked missions
const available = getAvailableMissions()

// Get locked missions with reasons
const locked = getLockedMissions()
```

#### Check Progress
```javascript
const { getCurrentTier, getNextMilestoneProgress } = useMissionSystem(userId)

// Get current achievement tier
const currentTier = getCurrentTier()
console.log(currentTier.title) // e.g., "Gravity Apprentice"

// Get progress towards next milestone
const progress = getNextMilestoneProgress()
console.log(progress.percentComplete) // 0-100
console.log(progress.requirements.totalWorkouts) // { current, required, percent }
```

---

### 4. **Mission Levels Quick Reference**

#### 🌱 Beginner (5 missions, no prereqs)
```javascript
- Pull Foundation Tuesday
- Core Foundation Wednesday  
- Legs Foundation Thursday
- Full Body Friday
- Sunday Mobility
```

#### ⚡ Fat Burn (4 missions, needs 3-5 Beginner completions)
```javascript
- Saturday Endurance
- Saturday Explosive
- Combination Friday
- Century Pusher (monthly)
```

#### 📈 Intermediate (6 missions, needs 5 Beginner completions)
```javascript
- Push Progression Monday
- Pull Progression Tuesday
- Legs Progression Thursday
- Advanced Core Wednesday
- Sunday Leverage
- One Arm Push Monday
```

#### 👑 Pro (8 missions, all locked, complex prereqs)
```javascript
- Archer Pull Monday
- Front Lever Wednesday
- Shrimp Squat Thursday
- Ultimate Combo Friday
- Saturday Back Lever
- Sunday Flag Progression
- One Arm Pull Tuesday
- Ultimate Test Friday
```

---

### 5. **API Endpoints**

#### Complete a Mission
```javascript
POST /api/missions/complete
Body: { userId, missionId }

Response: {
  success: true,
  xpGained: 60,
  newTotalXP: 500,
  totalWorkouts: 10,
  currentStreak: 5,
  missionLevel: "fat-burn",
  newBadges: [...],           // Array of newly unlocked badges
  newMilestones: [...]        // Array of newly unlocked milestones
}
```

#### Get User Progress
```javascript
GET /api/missions/progress?userId=user_123

Response: {
  success: true,
  progress: {
    totalWorkouts: 10,
    totalXP: 500,
    currentStreak: 5,
    completedMissions: [...],
    unlockedSkillBadges: [...],
    unlockedMilestones: [...],
    completedLevels: ["beginner"],
    categoryProgress: { push: 3, pull: 2, ... }
  }
}
```

---

### 6. **Component Examples**

#### Display All Missions by Level
```javascript
import MissionsByLevel from '@/components/MissionsByLevel'

export default function Page() {
  return <MissionsByLevel />
}
```

#### Display Achievements
```javascript
import AchievementsShowcase from '@/components/AchievementsShowcase'

export default function Page() {
  return <AchievementsShowcase />
}
```

---

### 7. **Badge & Milestone Quick Reference**

#### Skill Badges (Unlock in ~5-10 weeks)
```
🔨 Hydraulic Press  (Push mastery)
⚓ Iron Anchor       (Pull mastery)
🧘 Midsection Monk  (Core mastery)
⚙️ Piston Power     (Legs mastery)
⚡ Total Kinetic    (Combination mastery)
🔋 Eternal Battery  (Endurance mastery)
🌌 Gravity Defier   (Leverage mastery)
```

#### Milestones (Progression path)
```
🌱 The Calisthenics Recruit  → Complete 1 mission
📚 Gravity Apprentice         → 10 workouts, 250 XP
🏗️ Kinetic Architect          → 25 workouts, 750 XP
👑 Sovereign of Steel         → 50 workouts, 1500 XP
⭐ Legendary Athlete          → 100 workouts, 3000 XP, 28 consecutive days
```

---

### 8. **Integration Checklist**

- [ ] Data file imported: `data/missionsSystem.js`
- [ ] Hook added to component: `useMissionSystem(userId)`
- [ ] Components displayed: `MissionsByLevel`, `AchievementsShowcase`
- [ ] API endpoints working: `/api/missions/complete`, `/api/missions/progress`
- [ ] User session available for userId
- [ ] Database synced with user model
- [ ] Test mission completion flow
- [ ] Verify badge/milestone unlocks
- [ ] Check UI responsiveness

---

### 9. **Testing the System**

#### Test 1: Complete a Beginner Mission
```javascript
const response = await fetch('/api/missions/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test_user',
    missionId: 'full-body-friday'
  })
})
```

#### Test 2: Check Locked Missions
```javascript
// Try to complete a Pro mission without prerequisites
const response = await fetch('/api/missions/complete', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'test_user',
    missionId: 'archer-pull-monday' // Should be locked
  })
})
// Should return: { error: 'Prerequisites not met' }
```

#### Test 3: Unlock a Badge
```javascript
// Complete 5 Beginner missions to check for badge unlock
// Check response.newBadges array for unlocked badge
```

---

### 10. **Common Questions**

**Q: How do I set the user's mission level?**
A: Mission level is automatically set based on missions completed, not manually set.

**Q: Can users do missions multiple times?**
A: Yes! Each mission can be done unlimited times for XP (though daily limits could be added).

**Q: How are prerequisites checked?**
A: Before allowing mission completion, the system verifies all prerequisite missions have been completed the required number of times.

**Q: What if a user completes missions offline?**
A: The API handles all progress tracking. Sync happens when they go online.

**Q: Can I modify mission difficulties?**
A: Yes, in `data/missionsSystem.js` - edit the `difficulty` field on any mission.

**Q: How do I add new missions?**
A: Add to `allMissions` array in `data/missionsSystem.js` following the same structure.

---

### 11. **File Reference**

| File | Purpose |
|------|---------|
| `data/missionsSystem.js` | Mission, badge, milestone definitions |
| `hooks/useMissionSystem.js` | React hook for mission logic |
| `components/MissionsByLevel.jsx` | Display missions by difficulty |
| `components/AchievementsShowcase.jsx` | Display badges & milestones |
| `app/api/missions/complete/route.js` | Mission completion endpoint |
| `app/api/missions/progress/route.js` | Progress tracking endpoint |
| `app/missions/page.jsx` | Landing page for mission system |
| `MISSION_SYSTEM.md` | Detailed documentation |

---

### 12. **Support Resources**

- 📖 **Full Documentation:** `MISSION_SYSTEM.md`
- 📝 **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- 💻 **Code Examples:** See components in `/components`
- 🔌 **API Reference:** API endpoints section above
- 🎮 **Live Demo:** Visit `/missions` route

---

## You're Ready! 🎉

The mission system is now integrated and ready to use. Start with:

1. Navigate to `/missions` to see the UI
2. Import `useMissionSystem` in your dashboard
3. Display missions using `MissionsByLevel` component
4. Call `completeMission()` when user finishes a workout
5. Track progress with `userProgress` from the hook

Happy calisthenics training! 💪
