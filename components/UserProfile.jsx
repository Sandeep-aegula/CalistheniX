'use client'

import { motion } from 'framer-motion'
import { Zap, TrendingUp, User, Calendar, Gauge, Award, Activity } from 'lucide-react'
import { cn, formatNumber, getXPProgressForCurrentLevel } from '@/lib/utils'
import Card from '@/components/ui/Card'

const XPDisplay = ({ 
  xp = 0,
  level = 1,
  showAnimation = false,
  className,
  ...props 
}) => {
  const xpProgress = getXPProgressForCurrentLevel(xp, level)

  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Level Display */}
      <div className="flex items-center gap-6">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-20 h-20 bg-iron rounded-2xl flex items-center justify-center border-2 border-bronze shadow-[0_0_20px_rgba(205,127,50,0.3)] rotate-3">
             <div className="-rotate-3 flex flex-col items-center">
                <span className="text-[10px] lowercase font-black text-white/40 tracking-widest leading-none">lvl</span>
                <span className="text-3xl font-black text-bronze">{level}</span>
             </div>
          </div>
          
          {showAnimation && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-4 border-bronze"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-black tracking-tighter uppercase italic">
            Athlete <span className="text-bronze">Rank</span>
          </h3>
          <p className="text-sm font-bold text-muted-foreground lowercase tracking-widest">
            {formatNumber(xp)} <span className="text-[10px]">total xp</span>
          </p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="flex items-center gap-2 text-[10px] font-black lowercase tracking-[0.2em] text-muted-foreground">
            <Gauge className="w-3 h-3 text-primary" />
            progression logic
          </span>
          <span className="font-mono text-xs font-bold text-bronze">
            {formatNumber(xpProgress.current)} XP
          </span>
        </div>
        
        <div className="h-4 bg-iron rounded-full overflow-hidden border border-white/5 p-1">
           <motion.div 
             className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
             initial={{ width: 0 }}
             animate={{ width: `${xpProgress.percentage}%` }}
             transition={{ duration: 1, ease: "easeOut" }}
           />
        </div>
        
        <div className="flex justify-between text-[10px] font-black lowercase tracking-widest text-muted-foreground/40">
           <span>level {level}</span>
           <span>level {level + 1}</span>
        </div>
      </div>
    </motion.div>
  )
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  className,
  ...props 
}) => {
  return (
    <Card variant="iron" className={cn('text-center py-8 relative group overflow-hidden', className)} {...props}>
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform">
        <Icon className="w-12 h-12" />
      </div>
      
      <div className="relative z-10">
        <motion.div 
          className="text-4xl font-black text-bronze tracking-tighter mb-1 lowercase"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {value}
        </motion.div>
        <div className="text-[10px] font-black text-white/50 lowercase tracking-[0.3em]">{title}</div>
      </div>
      
      {/* Bottom Shine */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </Card>
  )
}

const UserProfile = ({ 
  user,
  showAnimation = false,
  className,
  ...props 
}) => {
  if (!user) {
    return (
      <Card variant="iron" className={cn('text-center p-12 border-dashed border-white/10', className)}>
        <User className="w-12 h-12 mx-auto text-bronze mb-4 opacity-50" />
        <p className="text-xs lowercase font-black tracking-widest text-white/40">system: identity required</p>
      </Card>
    )
  }

  return (
    <motion.div
      className={cn('space-y-8', className)}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* User Header */}
      <div className="flex items-center gap-6">
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-iron border-2 border-gray-300 shadow-2xl relative">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl border-4 border-background flex items-center justify-center shadow-lg">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </motion.div>
        
        <div className="flex-1">
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter italic leading-none mb-1">
            {user.name || user.username}
          </h2>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-muted-foreground lowercase tracking-widest">sector: elite</span>
             <div className="w-1 h-1 rounded-full bg-gray-400" />
             <span className="text-xs font-bold text-bronze lowercase tracking-widest flex items-center gap-1">
                <Award className="w-3 h-3" /> division ii
             </span>
          </div>
        </div>
      </div>

      {/* XP and Level Display */}
      <div className="p-8 rounded-[40px] bg-iron/5 border border-gray-200 glass-panel">
        <XPDisplay 
          xp={user.xp || 0}
          level={user.level || 1}
          showAnimation={showAnimation}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Workouts"
          value={user.totalWorkouts || 0}
          icon={Activity}
        />
        <StatCard 
          title="Streak"
          value={user.currentStreak || 0}
          icon={TrendingUp}
        />
        <StatCard 
          title="Skills"
          value={user.unlockedSkills?.length || 0}
          icon={Zap}
        />
        <StatCard 
          title="Badges"
          value={user.badges?.length || 0}
          icon={Award}
        />
      </div>
    </motion.div>
  )
}

export default UserProfile