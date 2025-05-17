import React from "react";
import { SignInButton } from "@clerk/nextjs";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans mt-20">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-black">
        <h1 className="text-5xl font-bold mb-4">CalistheniX</h1>
        <p className="text-xl font-semibold mb-6">The Game of Gains</p>
        <p className="text-lg max-w-xl mx-auto mb-8">
          Unlock real calisthenics skills through game-like daily missions, XP rewards, and a visual skill tree.
        </p>
        <SignInButton>
        <button className="bg-white pointer text-black px-6 py-3 font-bold rounded-lg hover:bg-gray-300 transition">
          Get Started
        </button>
        </SignInButton>
      </section>

      {/* How It Works */}
      <section className="py-16 px-8 bg-gray-900 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Choose a Skill</h3>
            <p>Pick a move like L-sit or Muscle-up — get a personalized training path.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Complete Missions</h3>
            <p>Daily XP-based tasks help you steadily build strength and skills.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Unlock the Skill</h3>
            <p>Beat the final challenge to earn rewards and level up in real life.</p>
          </div>
        </div>
      </section>

      {/* Skill Rewards */}
      <section className="py-16 px-8 bg-black text-center">
        <h2 className="text-3xl font-bold mb-8">Skill Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Muscle-Up", desc: "Complete missions to unlock." },
            { title: "Planche", desc: "Complete missions to unlock." },
            { title: "Front Lever", desc: "Complete missions to unlock." },
            { title: "Back Lever", desc: "Complete missions to unlock." },
          ].map((skill, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl shadow">
              <h4 className="text-xl font-semibold mb-2">{skill.title}</h4>
              <p className="text-sm text-gray-300">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 text-center bg-gray-950">
        <h2 className="text-3xl font-bold mb-4">Ready to Train Like a Hero?</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Start your journey with daily missions and unlock your potential. CalistheniX turns workouts into a game.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 font-bold rounded-lg transition">
          Join Now
        </button>
      </section>

      
    </div>
  );
}
