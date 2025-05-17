'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const skillData = {
  'muscle-up': {
    skill: 'Muscle-Up',
    reward: 'Unlock Muscle-Up Skill',
    image: '/skills/muscle-up.jpg',
    missions: [
      '10 explosive pull-ups',
      '5 sets of chest-to-bar pull-ups',
      'Straight bar dips (3×10)',
      'Jumping muscle-ups (3×5)',
      'Negative muscle-ups (3 reps, slow descent)',
    ],
    finalChallenge: 'Perform 1 clean bar muscle-up',
  },
  'planche': {
    skill: 'Planche',
    reward: 'Unlock Planche Skill',
    image: '/skills/planche.jpg',
    missions: [
      'Frog stand (30s hold)',
      'Tuck planche holds (3×15s)',
      'Planche leans (5×10s)',
      'Straight arm support holds',
      'Band-assisted planche holds',
    ],
    finalChallenge: '5s Tuck Planche hold',
  },
  // Add more skill data similarly...
};

export default function SkillPage() {
  const { skill } = useParams();
  const data = skillData[skill];

  if (!data) {
    return (
      <div className="p-6 mt-20 text-center text-xl text-red-600">
        ⚠️ Skill "{skill}" not found.
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-3xl mx-auto">
      <motion.h1
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 {data.skill}
      </motion.h1>

      <motion.p
        className="text-lg text-gray-600 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🎯 {data.reward}
      </motion.p>

      <motion.div
        className="w-full h-64 relative mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Image
          src={data.image}
          alt={`${data.skill} illustration`}
          fill
          className="rounded-xl object-cover"
          priority
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-semibold mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        📋 Missions
      </motion.h2>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        {data.missions.map((mission, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            📝 {mission}
          </motion.li>
        ))}
      </ul>

      <motion.h2
        className="mt-6 text-xl font-semibold text-green-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        ✅ Final Challenge: {data.finalChallenge}
      </motion.h2>
    </div>
  );
}
