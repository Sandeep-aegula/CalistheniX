// 'use client';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Card, CardContent } from '@/components/ui/card';

// const skills = [
//   {
//     skill: 'Muscle-Up',
//     reward: 'Unlock Muscle-Up Skill',
//     missions: [
//       '10 explosive pull-ups',
//       '5 sets of chest-to-bar pull-ups',
//       'Straight bar dips (3×10)',
//       'Jumping muscle-ups (3×5)',
//       'Negative muscle-ups (3 reps, slow descent)',
//     ],
//     finalChallenge: 'Perform 1 clean bar muscle-up',
//   },
//   {
//     skill: 'Planche',
//     reward: 'Unlock Planche Skill',
//     missions: [
//       'Frog stand (30s hold)',
//       'Tuck planche holds (3×15s)',
//       'Planche leans (5×10s)',
//       'Straight arm support holds',
//       'Band-assisted planche holds',
//     ],
//     finalChallenge: '5s Tuck Planche hold',
//   },
//   {
//     skill: 'Front Lever',
//     reward: 'Unlock Front Lever Skill',
//     missions: [
//       'Tuck front lever (3×10s)',
//       'Advanced tuck front lever (3×8s)',
//       'Front lever raises (3×5)',
//       'Ice cream makers (3×5)',
//       'Straddle holds on rings',
//     ],
//     finalChallenge: '5s Straddle Front Lever hold',
//   },
//   {
//     skill: 'Back Lever',
//     reward: 'Unlock Back Lever Skill',
//     missions: [
//       'Skin the cat (3 reps)',
//       'Tuck back lever (3×10s)',
//       'Advanced tuck holds (3×8s)',
//       'Back lever negatives',
//       'Band-assisted back levers',
//     ],
//     finalChallenge: '5s Back Lever',
//   },
//   {
//     skill: 'Human Flag',
//     reward: 'Unlock Human Flag Skill',
//     missions: [
//       'Wall-assisted human flag holds (5×10s)',
//       'Vertical flag raises (3 reps)',
//       'Flag tuck holds',
//       'Core and oblique strengthening',
//     ],
//     finalChallenge: '3s Human Flag hold',
//   },
// ];

// const Dashboard = () => {
//   return (
//     <div className="p-6 mt-20">
//       <h1 className="text-4xl font-bold mb-8 text-center">🏆 CalistheniX Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {skills.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Link href={`/dashboard/${item.skill.toLowerCase().replace(/\s+/g, '-')}`}>
//               <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer">
//                 <CardContent className="p-6 space-y-4">
//                   <h2 className="text-xl font-semibold">{item.skill}</h2>
//                   <p className="text-sm text-gray-500">🎯 {item.reward}</p>
//                   <ul className="list-disc pl-4 space-y-1 text-sm">
//                     {item.missions.map((mission, i) => (
//                       <li key={i}>📝 {mission}</li>
//                     ))}
//                   </ul>
//                   <p className="font-medium text-green-600">✅ Final Challenge: {item.finalChallenge}</p>
//                 </CardContent>
//               </Card>
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // You can use Radix or custom UI for progress

const skills = [
  {
    skill: 'Muscle-Up',
    reward: 'Unlock Muscle-Up Skill',
    xp: 45,
    missions: [
      '10 explosive pull-ups',
      '5 sets of chest-to-bar pull-ups',
      'Straight bar dips (3×10)',
      'Jumping muscle-ups (3×5)',
      'Negative muscle-ups (3 reps, slow descent)',
    ],
    finalChallenge: 'Perform 1 clean bar muscle-up',
  },
  {
    skill: 'Planche',
    reward: 'Unlock Planche Skill',
    xp: 20,
    missions: [
      'Frog stand (30s hold)',
      'Tuck planche holds (3×15s)',
      'Planche leans (5×10s)',
      'Straight arm support holds',
      'Band-assisted planche holds',
    ],
    finalChallenge: '5s Tuck Planche hold',
  },
  {
    skill: 'Front Lever',
    reward: 'Unlock Front Lever Skill',
    xp: 60,
    missions: [
      'Tuck front lever (3×10s)',
      'Advanced tuck front lever (3×8s)',
      'Front lever raises (3×5)',
      'Ice cream makers (3×5)',
      'Straddle holds on rings',
    ],
    finalChallenge: '5s Straddle Front Lever hold',
  },
  {
    skill: 'Back Lever',
    reward: 'Unlock Back Lever Skill',
    xp: 80,
    missions: [
      'Skin the cat (3 reps)',
      'Tuck back lever (3×10s)',
      'Advanced tuck holds (3×8s)',
      'Back lever negatives',
      'Band-assisted back levers',
    ],
    finalChallenge: '5s Back Lever',
  },
  {
    skill: 'Human Flag',
    reward: 'Unlock Human Flag Skill',
    xp: 10,
    missions: [
      'Wall-assisted human flag holds (5×10s)',
      'Vertical flag raises (3 reps)',
      'Flag tuck holds',
      'Core and oblique strengthening',
    ],
    finalChallenge: '3s Human Flag hold',
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center text-primary">🏆 CalistheniX Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {skills.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/dashboard/${item.skill.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className="rounded-xl shadow-md border hover:shadow-xl transition duration-300 cursor-pointer bg-white dark:bg-gray-900">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{item.skill}</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-200">
                      {item.xp} XP
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">🎯 {item.reward}</p>

                  <div className="space-y-2">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {item.missions.map((mission, i) => (
                        <li key={i}>📝 {mission}</li>
                      ))}
                    </ul>
                    <p className="font-medium text-green-600">
                      ✅ Final Challenge: {item.finalChallenge}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <p className="text-xs mb-1 text-gray-400">Progress</p>
                    <Progress value={item.xp} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
