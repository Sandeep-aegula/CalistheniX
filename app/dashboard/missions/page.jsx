// export default function MissionsPage() {
//     return (
//       <div className="bg-black min-h-screen text-white p-4">
//         {/* Welcome and Avatar */}
//         <div className="text-center mb-6">
//           <p className="text-gray-400">Welcome Back,</p>
//           <h1 className="text-2xl font-mono">Player</h1>
//           <div className="my-4">
//             <img src="/images/avatar.png" alt="avatar" className="w-24 h-24 mx-auto" />
//             <div className="bg-gray-700 h-2 rounded-full mt-2">
//               <div className="bg-yellow-400 h-2 rounded-full w-[50%]"></div>
//             </div>
//           </div>
//         </div>
  
//         {/* Calendar */}
//         <div className="flex justify-around mb-6">
//           {["Wed 12", "Thu 13", "Fri 14", "Sat 15", "Sun 16"].map((day, idx) => (
//             <div key={day} className={`text-center ${idx === 2 ? "text-yellow-400" : ""}`}>
//               {day}
//             </div>
//           ))}
//         </div>
  
//         {/* Daily Missions */}
//         <h2 className="font-semibold text-lg mb-2">Daily Missions</h2>
//         {[
//           "10 Push Ups",
//           "10 Pull Ups",
//           "10 Sit Ups"
//         ].map((task) => (
//           <div key={task} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center mb-2">
//             <div>
//               <p>{task}</p>
//               <p className="text-xs text-gray-400">3 Sets | 10 mins</p>
//             </div>
//             <span className="bg-yellow-400 text-black px-2 py-1 rounded">Done</span>
//           </div>
//         ))}
//       </div>
//     );
//   }
  
// app/missions/page.tsx
export default function MissionsPage() {
    const missions = [
      { title: "10 Push-ups", completed: true },
      { title: "5 Pull-ups", completed: false },
      { title: "30s Plank", completed: false },
    ];
  
    return (
      <main className="min-h-screen bg-black text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Daily Missions</h1>
  
        <div className="space-y-4">
          {missions.map((mission, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl flex justify-between items-center ${
                mission.completed ? "bg-green-600" : "bg-zinc-800"
              }`}
            >
              <span className="text-lg">{mission.title}</span>
              {mission.completed && <span>✅</span>}
            </div>
          ))}
        </div>
      </main>
    );
  }
  