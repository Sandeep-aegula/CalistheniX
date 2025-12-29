/**
 * AchievementShowcase Component
 * Displays skill badges, milestone achievements, and progress
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from './ui/Card'
import Progress from './ui/Progress'

const AchievementShowcase = ({
  userProgress = {},
  skillBadges = [],
  milestones = [],
  earnedBadges = [],
  earnedMilestones = []
}) => {
  const [activeTab, setActiveTab] = useState('badges')
  const [selectedItem, setSelectedItem] = useState(null)

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-red-500'
  }

  const rarityBgColors = {
    common: 'bg-gray-100',
    rare: 'bg-blue-100',
    epic: 'bg-purple-100',
    legendary: 'bg-yellow-100'
  }

  const rarityTextColors = {
    common: 'text-gray-800',
    rare: 'text-blue-800',
    epic: 'text-purple-800',
    legendary: 'text-yellow-900'
  }

  // ==================== SKILL BADGES ====================

  const SkillBadgesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Category Skill Badges
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Unlock badges by mastering all movements in each category.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillBadges.map((badge) => {
            const isEarned = earnedBadges.some(b => b.badgeId === badge.id)
            const earnDate = earnedBadges.find(b => b.badgeId === badge.id)
              ?.earnedAt

            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: isEarned ? 1.05 : 1 }}
                onClick={() => isEarned && setSelectedItem({ ...badge, type: 'badge' })}
                className={`cursor-pointer transition-all duration-300 ${
                  !isEarned ? 'opacity-40' : ''
                }`}
              >
                <Card
                  className={`text-center h-full ${
                    isEarned ? 'shadow-lg' : ''
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${
                      rarityColors[badge.rarity]
                    } text-4xl mb-3 mx-auto`}
                  >
                    {badge.icon}
                  </div>

                  <h4 className="font-bold text-gray-800 mb-1">
                    {badge.title}
                  </h4>

                  <p className="text-xs text-gray-600 mb-3">
                    {badge.category.charAt(0).toUpperCase() +
                      badge.category.slice(1)}{' '}
                    Category
                  </p>

                  <div className="mb-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        rarityBgColors[badge.rarity]
                      } ${rarityTextColors[badge.rarity]}`}
                    >
                      {badge.rarity.charAt(0).toUpperCase() +
                        badge.rarity.slice(1)}
                    </span>
                  </div>

                  {isEarned && (
                    <div className="text-xs text-green-700 font-semibold">
                      ✓ Unlocked
                    </div>
                  )}

                  {!isEarned && (
                    <div className="text-xs text-gray-500 font-semibold">
                      🔒 Locked
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ==================== MILESTONE ACHIEVEMENTS ====================

  const MilestonesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Milestone Achievements
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Reach major accomplishments to unlock prestigious titles.
        </p>

        <div className="space-y-4">
          {milestones.map((milestone) => {
            const isEarned = earnedMilestones.some(
              m => m.milestoneId === milestone.id
            )
            const earnDate = earnedMilestones.find(
              m => m.milestoneId === milestone.id
            )?.earnedAt

            let progressData = {
              current: 0,
              total: 1,
              percentage: 0
            }

            // Calculate progress based on condition
            if (milestone.condition.totalMissionsCompleted) {
              progressData = {
                current: Math.min(
                  userProgress.totalMissionsCompleted || 0,
                  milestone.condition.totalMissionsCompleted
                ),
                total: milestone.condition.totalMissionsCompleted,
                percentage: Math.floor(
                  ((userProgress.totalMissionsCompleted || 0) /
                    milestone.condition.totalMissionsCompleted) *
                    100
                )
              }
            } else if (milestone.condition.consecutiveDays) {
              progressData = {
                current: Math.min(
                  userProgress.currentStreak || 0,
                  milestone.condition.consecutiveDays
                ),
                total: milestone.condition.consecutiveDays,
                percentage: Math.floor(
                  ((userProgress.currentStreak || 0) /
                    milestone.condition.consecutiveDays) *
                    100
                )
              }
            } else if (milestone.condition.minXP) {
              progressData = {
                current: Math.min(
                  userProgress.xp || 0,
                  milestone.condition.minXP
                ),
                total: milestone.condition.minXP,
                percentage: Math.floor(
                  ((userProgress.xp || 0) / milestone.condition.minXP) * 100
                )
              }
            }

            return (
              <motion.div
                key={milestone.id}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  setSelectedItem({ ...milestone, type: 'milestone' })
                }
                className="cursor-pointer"
              >
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                        isEarned
                          ? `bg-gradient-to-br ${
                              rarityColors[milestone.rarity]
                            } shadow-lg`
                          : 'bg-gray-200'
                      }`}
                    >
                      {milestone.icon}
                    </div>

                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 mb-1">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {milestone.description}
                      </p>

                      {!isEarned && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>
                              {progressData.current} / {progressData.total}
                            </span>
                            <span>{progressData.percentage}%</span>
                          </div>
                          <Progress
                            value={progressData.percentage}
                            className="h-2"
                          />
                        </div>
                      )}

                      {isEarned && (
                        <div className="text-xs text-green-700 font-bold flex items-center gap-1">
                          ✓ Unlocked on{' '}
                          {new Date(earnDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {isEarned && (
                      <div className="flex-shrink-0">
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800">
                          +{milestone.xpBonus} XP
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ==================== DETAIL MODAL ====================

  const DetailModal = () => {
    if (!selectedItem) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedItem(null)}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg p-6 max-w-md w-full"
        >
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${
                rarityColors[selectedItem.rarity]
              } text-5xl mb-4 mx-auto`}
            >
              {selectedItem.icon}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedItem.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {selectedItem.description}
            </p>

            <div className="mb-4">
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  rarityBgColors[selectedItem.rarity]
                } ${rarityTextColors[selectedItem.rarity]}`}
              >
                {selectedItem.rarity.toUpperCase()}
              </span>
            </div>

            {selectedItem.type === 'badge' && selectedItem.category && (
              <p className="text-xs text-gray-600 mb-4">
                Master the {selectedItem.category.toUpperCase()} category
              </p>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // ==================== MAIN RENDER ====================

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'badges'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          🎖️ Skill Badges
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'milestones'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          👑 Milestones
        </button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'badges' && <SkillBadgesSection />}
        {activeTab === 'milestones' && <MilestonesSection />}
      </motion.div>

      {/* Detail Modal */}
      <DetailModal />
    </div>
  )
}

export default AchievementShowcase
