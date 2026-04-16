'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { allMissions, missionLevels, difficultyDescriptions, xpMultipliers } from '@/data/missionsSystem'

export default function MissionsByLevel({ userMissionLevel = null }) {
  // Default to user's current mission level, or BEGINNER if not provided
  const defaultLevel = userMissionLevel || missionLevels.BEGINNER
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel)
  const [expandedMission, setExpandedMission] = useState(null)

  const levelConfig = {
    [missionLevels.BEGINNER]: {
      title: '🌱 The Foundation',
      subtitle: 'Building basic strength, tendon durability, and introductory muscle endurance',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    [missionLevels.FAT_BURN]: {
      title: '⚡ The Metabolic Engine',
      subtitle: 'High-intensity movements and cardiovascular endurance to maximize calorie expenditure',
      color: 'from-orange-500 to-red-600',
      textColor: 'text-orange-600'
    },
    [missionLevels.INTERMEDIATE]: {
      title: '📈 The Progression',
      subtitle: 'Mastering leverage, unilateral movements, and increased volume',
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-600'
    },
    [missionLevels.PRO]: {
      title: '👑 The Mastery',
      subtitle: 'Static holds, elite leverage, and high-difficulty skills',
      color: 'from-yellow-500 to-orange-600',
      textColor: 'text-yellow-600'
    }
  }

  // Determine which levels are unlocked based on user's mission level
  const getUnlockedLevels = () => {
    const allLevels = Object.values(missionLevels)
    if (!userMissionLevel) return allLevels // Show all if no user level provided
    
    const levelOrder = [missionLevels.BEGINNER, missionLevels.FAT_BURN, missionLevels.INTERMEDIATE, missionLevels.PRO]
    const userLevelIndex = levelOrder.indexOf(userMissionLevel)
    
    // User can access their current level and all previous levels
    return levelOrder.slice(0, userLevelIndex + 1)
  }

  const unlockedLevels = getUnlockedLevels()
  const canAccessLevel = (level) => unlockedLevels.includes(level)

  const config = levelConfig[selectedLevel]
  const filteredMissions = allMissions.filter(m => m.level === selectedLevel)

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-8 min-h-screen">
      {/* Level Selector */}
      <div className="mb-8 flex gap-3 flex-wrap">
        {Object.values(missionLevels).map(level => {
          const isActive = level === selectedLevel
          const isAccessible = canAccessLevel(level)
          const isCurrentUserLevel = level === userMissionLevel
          
          return (
            <button
              key={level}
              onClick={() => isAccessible && setSelectedLevel(level)}
              disabled={!isAccessible}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative ${
                !isAccessible
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : isActive
                  ? `bg-gradient-to-r ${levelConfig[level].color} text-white shadow-lg scale-105`
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {levelConfig[level].title}
              {isCurrentUserLevel && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></span>
              )}
              {!isAccessible && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-slate-900">
                  🔒
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Level Info */}
      <div className={`mb-8 p-6 bg-gradient-to-r ${config.color} rounded-xl text-white shadow-lg`}>
        <h1 className="text-4xl font-bold mb-2 uppercase italic tracking-tighter">{config.title}</h1>
        <p className="text-lg opacity-90 font-medium">{config.subtitle}</p>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMissions.map(mission => (
          <Card
            key={mission.id}
            className={`p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-l-4 ${
              mission.isLocked
                ? 'border-l-gray-400 opacity-60 hover:opacity-80'
                : `border-l-${
                    mission.category === 'push'
                      ? 'red'
                      : mission.category === 'pull'
                        ? 'blue'
                        : mission.category === 'core'
                          ? 'green'
                          : mission.category === 'legs'
                            ? 'purple'
                            : 'yellow'
                  }-500`
            }`}
            onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{mission.emoji}</span>
                  <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                </div>
                <p className="text-slate-300 text-sm">{mission.day}</p>
              </div>
              {mission.isLocked && (
                <div className="ml-4">
                  <span className="inline-block bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                    🔒 LOCKED
                  </span>
                </div>
              )}
            </div>

            {/* Category & Difficulty */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant="secondary" className="capitalize">
                {mission.category}
              </Badge>
              <Badge variant="outline">
                Difficulty: {mission.difficulty}/10
              </Badge>
              <Badge variant="accent">
                {mission.xpReward} XP
              </Badge>
            </div>

            {/* Short Description */}
            <p className="text-slate-300 mb-4">{mission.description}</p>

            {/* Skills Required */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-200 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {mission.skills.map(skill => (
                  <span
                    key={skill}
                    className="text-xs bg-slate-700 text-slate-100 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedMission === mission.id && (
              <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
                {/* Requirements */}
                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Requirements:</p>
                  <div className="space-y-2">
                    {mission.requirements.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                        <span className="text-slate-300">{req.skillName}</span>
                        <span className="font-bold text-blue-400">
                          {req.targetValue} {req.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {mission.prerequisites && mission.prerequisites.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-200 mb-2">Prerequisites:</p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ {mission.lockReason || 'Complete prerequisite missions first'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Difficulty Explanation */}
                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-2">Difficulty Level:</p>
                  <p className="text-slate-300 text-sm">
                    {difficultyDescriptions[mission.difficulty]}
                  </p>
                </div>

                {/* XP Calculation */}
                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-2">XP Reward:</p>
                  <div className="flex items-center justify-between bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded">
                    <span className="text-slate-300">Base XP</span>
                    <span className="font-bold text-green-400">{mission.xpReward}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Multiplier: {xpMultipliers[mission.level]}x ({(mission.xpReward * xpMultipliers[mission.level]).toFixed(0)} total)
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-all ${
                    mission.isLocked
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                  disabled={mission.isLocked}
                >
                  {mission.isLocked ? '🔒 Locked' : 'Start Mission'}
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Total Missions</p>
          <p className="text-3xl font-bold text-white">{filteredMissions.length}</p>
        </Card>
        <Card className="p-4 text-center bg-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Avg Difficulty</p>
          <p className="text-3xl font-bold text-white">
            {(filteredMissions.reduce((sum, m) => sum + m.difficulty, 0) / filteredMissions.length).toFixed(1)}/10
          </p>
        </Card>
        <Card className="p-4 text-center bg-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Total XP Available</p>
          <p className="text-3xl font-bold text-green-400">
            {filteredMissions.reduce((sum, m) => sum + m.xpReward, 0)}
          </p>
        </Card>
        <Card className="p-4 text-center bg-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Locked Missions</p>
          <p className="text-3xl font-bold text-yellow-400">
            {filteredMissions.filter(m => m.isLocked).length}
          </p>
        </Card>
      </div>
    </div>
  )
}
