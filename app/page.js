'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { 
  Zap, 
  Target, 
  Trophy, 
  ArrowRight,
  CheckCircle,
  Activity,
  Flame,
  Dumbbell,
  BicepsFlexed
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -50])

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (session) return null

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-iron flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-bronze" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                CalistheniX <span className="text-bronze not-italic font-light">Elite</span>
              </h1>
            </motion.div>
            
            <nav className="hidden md:flex items-center gap-10">
              {['Missions', 'Skills', 'Achievements'].map((item) => (
                <Link 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-xs font-bold text-muted-foreground hover:text-black transition-colors tracking-widest lowercase"
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => signIn()}
                className="hidden sm:flex text-xs font-bold"
              >
                login
              </Button>
              <Button 
                variant="cyber"
                onClick={() => signIn('google')}
                className="text-xs px-8"
              >
                get started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none steel-texture" />
        
        <motion.div 
          className="container mx-auto px-6 text-center z-10"
          style={{ opacity, y }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-iron text-white mb-10 shadow-xl border border-white/5">
              <Flame className="w-4 h-4 text-bronze animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] lowercase">sector: outdoor strength</span>
            </div>
            
            <h1 className="text-[10vw] md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
              GRIT. GEAR.<br />
              <span className="text-bronze">STRENGTH.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-medium lowercase">
              forge your body in the raw landscape of calisthenics. 
              metallic aesthetics meet elite-level programming.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="cyber" 
                size="xl" 
                onClick={() => signIn('google')}
                className="min-w-[260px] shadow-2xl"
              >
                start training <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="xl"
                className="min-w-[260px] bg-white border-2 border-iron"
                onClick={() => document.getElementById('missions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Protocol
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Iron Panels */}
        <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-iron rotate-12 opacity-5 rounded-[40px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-80 h-80 bg-iron -rotate-12 opacity-5 rounded-[60px] pointer-events-none" />
      </section>

      {/* Stats/Social Proof (Metallic Bar) */}
      <div className="bg-iron py-16 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: '28+', label: 'skills' },
              { val: '4 wks', label: 'program' },
              { val: '150+', label: 'missions' },
              { val: 'elite', label: 'status' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-black text-bronze tracking-tighter mb-2">{stat.val}</div>
                <div className="text-[10px] text-white/40 tracking-[0.4em] lowercase font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <section id="missions" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-24 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
              THE <span className="text-bronze">IRON</span> PROTOCOL
            </h2>
            <div className="h-1 w-24 bg-bronze rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Target className="w-8 h-8" />, 
                title: 'Phase I: Concrete', 
                desc: 'Master the foundations of the sport. Build the structural integrity required for elite flight.',
                tag: 'Foundational'
              },
              { 
                icon: <Activity className="w-8 h-8" />, 
                title: 'Phase II: Steel', 
                desc: 'Increase tension. Master leverage holds like the L-Sit and Pull-up variations.',
                tag: 'Intermediate'
              },
              { 
                icon: <BicepsFlexed className="w-8 h-8" />, 
                title: 'Phase III: Bronze', 
                desc: 'Reach legendary status. Complete muscle-ups and human flag progressions.',
                tag: 'Legendary'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="iron" className="h-full p-12 group" animate={i === 2}>
                  <div className="text-bronze mb-8 bg-white/5 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.3em] lowercase text-muted-foreground mb-4">{item.tag}</div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed font-medium lowercase">
                    {item.desc}
                  </p>
                  <Link href="/signup" className="mt-8 flex items-center gap-2 text-bronze font-bold text-sm hover:translate-x-2 transition-transform lowercase tracking-widest">
                    unlock <ArrowRight className="w-4 h-4" />
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-40 px-6 bg-steel relative">
        <div className="absolute inset-0 opacity-10 steel-texture pointer-events-none" />
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
              LEAVE THE <br />
              <span className="text-primary">AVERAGE.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-16 font-semibold lowercase tracking-tight">
              your evolution into an elite athlete begins with the first pull.
            </p>
            
            <Button 
              variant="cyber" 
              size="xl" 
              onClick={() => signIn('google')}
              className="w-full sm:w-auto px-16 shadow-2xl"
            >
              initialize profile
            </Button>
            
            <div className="flex flex-wrap items-center justify-center gap-10 mt-16 text-[10px] lowercase tracking-[0.4em] font-black text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> physical sovereignty</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> infinite progression</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> no hardware needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-300">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            <span className="text-[10px] tracking-[0.5em] font-black lowercase">calisthenix elite v3.0</span>
          </div>
          
          <p className="text-[10px] lowercase tracking-[0.3em] font-bold">
            forged in metal and concrete.
          </p>
          
          <div className="flex gap-8">
             <Trophy className="w-4 h-4" />
             <Zap className="w-4 h-4" />
          </div>
        </div>
      </footer>
    </div>
  )
}


