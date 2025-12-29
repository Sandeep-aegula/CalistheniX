'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { skillBadges, milestoneAchievements } from '@/data/missionsSystem'

export default function AchievementsShowcase() {
  const [activeTab, setActiveTab] = useState('skills')

  const rarityColors = {
    common: 'from-slate-500 to-slate-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  }

  const rarityBorder = {
    common: 'border-slate-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-300'
  }

  const rarityText = {
    common: 'text-slate-300',
    rare: 'text-blue-300',
    epic: 'text-purple-300',
    legendary: 'text-yellow-300'
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-8 min-h-screen">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🏆 Achievements & Badges</h1>
        <p className="text-slate-400">Unlock badges and milestones to become a legendary calisthenics athlete</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'skills'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🏷️ Skill Badges
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'milestones'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🎖️ Milestones
        </button>
      </div>

      {/* Skill Badges Tab */}
      {activeTab === 'skills' && (
        <div>
          <div className="mb-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">Category-Specific Skill Badges</h2>
            <p className="text-slate-300">
              Complete missions in each category to unlock powerful badges that showcase your expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillBadges.map(badge => (
              <Card
                key={badge.id}
                className={`p-6 bg-gradient-to-br ${rarityColors[badge.rarity]} border-2 ${rarityBorder[badge.rarity]} transform transition-all hover:scale-105 hover:shadow-xl`}
              >
                {/* Badge Icon */}
                <div className="text-6xl mb-4 text-center">{badge.icon}</div>

                {/* Badge Name */}
                <h3 className="text-xl font-bold text-white text-center mb-2">{badge.name}</h3>

                {/* Rarity */}
                <div className="text-center mb-4">
                  <Badge variant="secondary" className={`${rarityText[badge.rarity]} font-bold uppercase`}>
                    {badge.rarity}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-slate-100 text-sm text-center mb-4">{badge.description}</p>

                {/* Category */}
                <div className="mb-4 p-2 bg-black/20 rounded">
                  <p className="text-xs text-slate-200 text-center">
                    <span className="font-bold text-white uppercase">{badge.category}</span> Expertise
                  </p>
                </div>

                {/* Requirements */}
                <div className="text-xs text-slate-100 space-y-1">
                  <p className="font-bold">Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {badge.requirements.completedMissions.map(mission => (
                      <li key={mission} className="text-slate-200">
                        Complete {mission}
                      </li>
                    ))}
                    <li className="text-slate-200">
                      Min {badge.requirements.minCompletions} completions
                    </li>
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div>
          <div className="mb-6 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">Milestone Achievement Titles</h2>
            <p className="text-slate-300">
              Progress through ranks by completing workouts and earning skill badges. Reach "Legendary Athlete" after 28 consecutive days of all missions!
            </p>
          </div>

          <div className="space-y-6">
            {milestoneAchievements.map((milestone, idx) => (
              <Card
                key={milestone.id}
                className={`p-6 bg-gradient-to-r ${rarityColors[milestone.rarity]} border-2 ${rarityBorder[milestone.rarity]} transform transition-all hover:shadow-xl`}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="text-6xl flex-shrink-0">{milestone.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Tier Badge */}
                    <div className="mb-2">
                      <Badge variant="secondary" className={`${rarityText[milestone.rarity]} font-bold uppercase`}>
                        {milestone.tier}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2">{milestone.title}</h3>

                    {/* Description */}
                    <p className="text-slate-100 mb-4">{milestone.description}</p>

                    {/* Requirements */}
                    <div className="bg-black/20 rounded p-4 mb-4">
                      <p className="font-bold text-white mb-3">Requirements:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {milestone.requirements.totalWorkouts && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🏋️</span>
                            <div>
                              <p className="text-xs text-slate-300">Total Workouts</p>
                              <p className="font-bold text-white">{milestone.requirements.totalWorkouts}</p>
                            </div>
                          </div>
                        )}
                        {milestone.requirements.xp && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">⚡</span>
                            <div>
                              <p className="text-xs text-slate-300">Total XP</p>
                              <p className="font-bold text-white">{milestone.requirements.xp.toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        {milestone.requirements.consecutiveDays && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📅</span>
                            <div>
                              <p className="text-xs text-slate-300">Consecutive Days</p>
                              <p className="font-bold text-white">{milestone.requirements.consecutiveDays}</p>
                            </div>
                          </div>
                        )}
                        {milestone.requirements.skillBadges && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🏆</span>
                            <div>
                              <p className="text-xs text-slate-300">Skill Badges</p>
                              <p className="font-bold text-white">{milestone.requirements.skillBadges}</p>
                            </div>
                          </div>
                        )}
                        {milestone.requirements.completedLevels && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📈</span>
                            <div>
                              <p className="text-xs text-slate-300">Levels Completed</p>
                              <p className="font-bold text-white">{milestone.requirements.completedLevels.length}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* XP Bonus */}
                    {milestone.xpBonus > 0 && (
                      <div className="inline-block bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg font-bold">
                        +{milestone.xpBonus} XP Bonus
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">🎯 How to Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-bold text-blue-300 mb-2">1. Complete Missions</p>
            <p className="text-slate-300 text-sm">
              Start with beginner missions and unlock harder levels as you progress through the strength curve
            </p>
          </div>
          <div>
            <p className="font-bold text-green-300 mb-2">2. Earn Skill Badges</p>
            <p className="text-slate-300 text-sm">
              Unlock category-specific badges (Push, Pull, Core, Legs) by completing missions in each category
            </p>
          </div>
          <div>
            <p className="font-bold text-yellow-300 mb-2">3. Reach Milestones</p>
            <p className="text-slate-300 text-sm">
              Progress through ranks from Novice to Legendary Athlete by meeting comprehensive requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
