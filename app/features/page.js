'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: '🎮 XP-Based Skill Unlocking',
    description: 'Earn XP by completing daily tasks and use it to unlock advanced calisthenics skills.',
  },
  {
    title: '📅 Daily Missions',
    description: 'Stay consistent with tailored daily missions that build toward each skill milestone.',
  },
  {
    title: '🧠 Skill Tree Progression',
    description: 'Visualize your journey using an RPG-like skill tree with locked/unlocked stages.',
  },
  {
    title: '🏆 Leaderboards & Badges',
    description: 'Compete with friends and climb the leaderboard while earning badges for each skill.',
  },
  {
    title: '📈 Visual Roadmaps',
    description: 'Each skill includes a step-by-step progression roadmap to guide your training.',
  },
  {
    title: '🔓 Final Challenges',
    description: 'Unlock skills by completing a final test that proves your mastery of prior steps.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="p-6 mt-20">
      <h1 className="text-4xl font-bold text-center mb-10">💡 CalistheniX Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
