'use client'

import React from 'react'
import MissionsByLevel from '@/components/MissionsByLevel'
import AchievementsShowcase from '@/components/AchievementsShowcase'

export default function MissionSystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-white">🎯 CalistheniX Mission System</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Missions Section */}
        <section>
          <MissionsByLevel />
        </section>

        {/* Achievements Section */}
        <section>
          <AchievementsShowcase />
        </section>

        {/* Overview Section */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6">📊 System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Progression Flow */}
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Progression Flow</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <span className="text-3xl">🌱</span>
                  <div>
                    <p className="font-bold text-blue-300">Beginner: The Foundation</p>
                    <p className="text-sm text-slate-300">Build basic strength (5 missions)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <p className="font-bold text-orange-300">Fat Burn: Metabolic Engine</p>
                    <p className="text-sm text-slate-300">High-intensity work (4 missions)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <span className="text-3xl">📈</span>
                  <div>
                    <p className="font-bold text-purple-300">Intermediate: The Progression</p>
                    <p className="text-sm text-slate-300">Advanced techniques (6 missions)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <span className="text-3xl">👑</span>
                  <div>
                    <p className="font-bold text-yellow-300">Pro: The Mastery</p>
                    <p className="text-sm text-slate-300">Elite-level skills (8 missions)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Key Features</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Progressive Difficulty:</strong> Missions unlock as you complete prerequisites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>XP Multipliers:</strong> Each level rewards more XP (1.0x to 2.0x)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Skill Badges:</strong> 7 category-specific badges to unlock</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Milestones:</strong> 5 achievement tiers from Recruit to Legendary Athlete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Streak Tracking:</strong> Maintain consecutive days for special rewards</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* XP & Rewards */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6">⭐ XP & Rewards System</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Base XP by Level */}
            <div>
              <h3 className="text-lg font-bold text-emerald-400 mb-4">Base XP by Level</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Beginner Missions</span>
                  <span className="font-bold text-green-400">20-30 XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Fat Burn Missions</span>
                  <span className="font-bold text-green-400">40-50 XP (x1.2 multiplier)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Intermediate Missions</span>
                  <span className="font-bold text-green-400">40-55 XP (x1.5 multiplier)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Pro Missions</span>
                  <span className="font-bold text-green-400">75-125 XP (x2.0 multiplier)</span>
                </div>
              </div>
            </div>

            {/* Milestone Bonuses */}
            <div>
              <h3 className="text-lg font-bold text-amber-400 mb-4">Milestone XP Bonuses</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Gravity Apprentice</span>
                  <span className="font-bold text-amber-400">+100 XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Kinetic Architect</span>
                  <span className="font-bold text-amber-400">+250 XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Sovereign of Steel</span>
                  <span className="font-bold text-amber-400">+500 XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Legendary Athlete</span>
                  <span className="font-bold text-amber-400">+1000 XP</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>🏋️ Push your limits. Master calisthenics. Become legendary. 💪</p>
        </div>
      </footer>
    </div>
  )
}
