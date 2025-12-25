'use client'

import { motion } from 'framer-motion'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Zap, 
  Target, 
  Trophy, 
  ArrowRight,
  LogIn,
  Star,
  CheckCircle
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              CalistheniX
            </motion.h1>
            
            <Button 
              variant="outline" 
              onClick={() => signIn()}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Game of Gains
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your bodyweight training into an epic RPG adventure. 
              Level up your skills, complete missions, and become the ultimate calisthenics warrior.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              variant="cyber" 
              size="xl" 
              onClick={() => signIn('google')}
              className="flex items-center gap-3"
            >
              <Zap className="w-6 h-6" />
              Start Your Journey
              <ArrowRight className="w-6 h-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => signIn()}
            >
              Other Sign In Options
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Why Choose CalistheniX?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience bodyweight training like never before with our gamified approach
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full text-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Progressive Skill Tree</h3>
                <p className="text-muted-foreground">
                  Unlock advanced calisthenics moves step by step. Master the basics to access legendary skills like the human flag and one-arm pull-up.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full text-center p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Mission System</h3>
                <p className="text-muted-foreground">
                  Complete daily, weekly, and monthly challenges. Earn XP, unlock achievements, and stay motivated with structured goals.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full text-center p-8 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-400/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Achievement System</h3>
                <p className="text-muted-foreground">
                  Collect badges, track streaks, and show off your progress. From common to legendary achievements await you.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Master Every Move
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From beginner push-ups to advanced human flags, unlock your potential
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Push-up', difficulty: 1, category: 'Foundation' },
              { name: 'Pull-up', difficulty: 3, category: 'Strength' },
              { name: 'L-sit', difficulty: 5, category: 'Core' },
              { name: 'Human Flag', difficulty: 10, category: 'Legendary' }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="text-center p-6 hover:border-primary/50 transition-colors">
                  <div className="flex justify-center mb-3">
                    {Array.from({ length: skill.difficulty }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <h3 className="font-bold mb-2">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground">{skill.category}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold gradient-text">
              Ready to Transform Your Training?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the ranks of calisthenics warriors. Your journey to mastery starts with a single sign-in.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="cyber" 
                size="xl" 
                onClick={() => signIn('google')}
                className="flex items-center gap-3"
              >
                <LogIn className="w-6 h-6" />
                Begin Your Adventure
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                No equipment needed
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                Progressive training
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Built with 💪 for calisthenics athletes everywhere
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            CalistheniX v1.0.0 - The Game of Gains
          </p>
        </div>
      </footer>
    </div>
  )
}