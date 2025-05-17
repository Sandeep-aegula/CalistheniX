// app/xp/page.tsx
export default function XPPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">XP Progress</h1>

      {/* XP Progress Bar */}
      <div className="bg-zinc-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>600/1000 XP</span>
          <span>Level 1</span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
          <div className="bg-green-500 h-3 w-[60%]"></div>
        </div>
      </div>

      {/* Weekly Stats */}
      <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div
            key={i}
            className={`flex items-center justify-center h-10 w-10 rounded-full ${
              i < 5 ? "bg-green-500" : "bg-zinc-700"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Streak */}
      <div className="text-center mt-4">
        <p className="text-lg">🔥 5 Day Streak</p>
      </div>
    </main>
  );
}
