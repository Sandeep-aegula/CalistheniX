// app/summary/page.tsx
export default function SummaryPage() {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Workout Summary</h1>
  
          <div className="bg-zinc-800 rounded-xl p-6 mb-4">
            <p className="text-xl mb-2">🏆 3 Missions Completed</p>
            <p className="text-lg">+150 XP</p>
          </div>
  
          <div className="bg-zinc-800 rounded-xl p-6 mb-4">
            <p className="text-xl">🔥 Streak: 5 Days</p>
          </div>
        </div>
  
        <button className="bg-green-500 text-black font-bold py-3 rounded-xl text-center">
          Finish Workout
        </button>
      </main>
    );
  }
  