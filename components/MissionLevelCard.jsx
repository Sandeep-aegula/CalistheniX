/**
 * MissionLevelCard Component
 * Displays missions organized by difficulty level with unlock prerequisites
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from './ui/Card'
import Badge from './ui/Badge'

const MissionLevelCard = ({ level, levelDetails, missions, userProgress, completedMissions }) => {
  const [expandedMission, setExpandedMission] = useState(null)

  const checkPrerequisitesMet = (mission) => {
    if (!mission.prerequisites || mission.prerequisites.length === 0) {
      return true
    }

    return mission.prerequisites.every(prerequisite => {
      const completed = completedMissions.filter(
        m => m.missionId === prerequisite.missionId
      )
      return completed.length >= (prerequisite.minCompletions || 1)
    })
  }

  const getPrerequisiteProgress = (mission) => {
    if (!mission.prerequisites || mission.prerequisites.length === 0) {
      return null
    }

    return mission.prerequisites.map(prerequisite => {
      const completed = completedMissions.filter(
        m => m.missionId === prerequisite.missionId
      ).length
      const required = prerequisite.minCompletions || 1

      return {
        missionId: prerequisite.missionId,
        completed,
        required,
        isMet: completed >= required
      }
    })
  }

  const difficultyColor = {
    1: 'from-green-400 to-green-500',
    2: 'from-green-500 to-blue-400',
    3: 'from-blue-400 to-blue-500',
    4: 'from-blue-500 to-purple-400',
    5: 'from-purple-400 to-purple-500',
    6: 'from-purple-500 to-orange-400',
    7: 'from-orange-400 to-orange-500',
    8: 'from-orange-500 to-red-400',
    9: 'from-red-400 to-red-500',
    10: 'from-red-500 to-red-600'
  }

  return (
    <div className="w-full">
      {/* Level Header */}
      <div className={`bg-gradient-to-r ${levelDetails.color} p-6 rounded-lg mb-6`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{levelDetails.icon}</span>
          <div>
            <h2 className="text-3xl font-bold text-white">{levelDetails.title}</h2>
            <p className="text-white/80">{levelDetails.description}</p>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => {
          const prereqsMet = checkPrerequisitesMet(mission)
          const prereqProgress = getPrerequisiteProgress(mission)
          const isExpanded = expandedMission === mission.id

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  prereqsMet
                    ? 'hover:shadow-lg hover:scale-105'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() =>
                  prereqsMet && setExpandedMission(isExpanded ? null : mission.id)
                }
              >
                {/* Mission Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{mission.emoji}</span>
                      <h3 className="text-lg font-bold text-gray-800">
                        {mission.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {mission.day || 'Anytime'}
                    </p>
                  </div>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    +{mission.xpReward} XP
                  </span>
                </div>

                {/* Difficulty Indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Difficulty
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {mission.difficulty}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        difficultyColor[mission.difficulty]
                      }`}
                      style={{
                        width: `${(mission.difficulty / 10) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Skills:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {mission.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3">
                  {mission.description}
                </p>

                {/* Lock/Unlock Status */}
                {!prereqsMet && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                    <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-2">
                      🔒 Locked - Complete Prerequisites
                    </p>
                    <div className="space-y-2">
                      {prereqProgress?.map((progress, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs"
                        >
                          <span
                            className={
                              progress.isMet
                                ? 'text-green-700 font-semibold'
                                : 'text-gray-600'
                            }
                          >
                            {progress.isMet ? '✓' : '○'} Mission {idx + 1}
                          </span>
                          <span className="text-gray-600">
                            {progress.completed}/{progress.required}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {prereqsMet && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Start Mission
                  </motion.button>
                )}

                {/* Expand Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <p className="text-xs text-gray-600 font-semibold mb-2">
                      Additional Details:
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Estimated Duration: 20-30 minutes</li>
                      <li>• Reward: {mission.xpReward} XP + Badge</li>
                      <li>
                        • Level: {levelDetails.title} ({level})
                      </li>
                    </ul>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default MissionLevelCard
