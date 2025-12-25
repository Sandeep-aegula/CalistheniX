'use client'

import { motion } from 'framer-motion'
import { Zap, TrendingUp, User, Calendar } from 'lucide-react'
import { cn, formatNumber, getXPProgressForCurrentLevel } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'

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
      className={cn('space-y-4', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Level Display */}
      <div className="flex items-center gap-4">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-black font-bold text-xl">
            {level}
          </div>
          
          {/* Level Up Animation */}
          {showAnimation && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold gradient-text">Level {level}</h3>
          <p className="text-muted-foreground">
            {formatNumber(xp)} Total XP
          </p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Progress to Level {level + 1}
          </span>
          <span className="font-mono">
            {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.needed)}
          </span>
        </div>
        
        <Progress 
          value={xpProgress.current}
          max={xpProgress.needed}
          variant="gradient"
          animated={showAnimation}
          className="h-3"
        />
        
        <div className="text-right text-xs text-muted-foreground">
          {Math.round(xpProgress.percentage)}% Complete
        </div>
      </div>
    </motion.div>
  )
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = null,
  formatValue = true,
  className,
  ...props 
}) => {
  const displayValue = formatValue ? formatNumber(value) : value

  return (
    <Card className={cn('text-center space-y-2', className)} {...props}>
      <div className="flex justify-center">
        <div className="p-3 rounded-full bg-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div>
        <motion.div 
          className="text-2xl font-bold font-mono text-foreground"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayValue}
        </motion.div>
        
        <div className="text-sm text-muted-foreground">{title}</div>
        
        {trend !== null && (
          <div className={cn(
            "flex items-center justify-center gap-1 text-xs mt-1",
            trend > 0 ? "text-secondary" : trend < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            <TrendingUp className={cn(
              "w-3 h-3",
              trend < 0 && "rotate-180"
            )} />
            {Math.abs(trend)}% from last week
          </div>
        )}
      </div>
    </Card>
  )
}

const UserProfile = ({ 
  user,
  showXPAnimation = false,
  className,
  ...props 
}) => {
  if (!user) {
    return (
      <Card className={cn('text-center p-8', className)}>
        <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Sign in to track your progress</p>
      </Card>
    )
  }

  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* User Header */}
      <div className="flex items-center gap-4">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-16 h-16 rounded-full border-2 border-primary"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-black" />
            </div>
          )}
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-2 h-2 bg-background rounded-full"></div>
          </div>
        </motion.div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">
            {user.name || user.username}
          </h2>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.joinedAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" />
              Member since {new Date(user.joinedAt).getFullYear()}
            </p>
          )}
        </div>
      </div>

      {/* XP and Level Display */}
      <XPDisplay 
        xp={user.xp || 0}
        level={user.level || 1}
        showAnimation={showXPAnimation}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Workouts"
          value={user.totalWorkouts || 0}
          icon={TrendingUp}
          formatValue={false}
        />
        <StatCard 
          title="Streak"
          value={user.currentStreak || 0}
          icon={Calendar}
          formatValue={false}
        />
        <StatCard 
          title="Skills"
          value={user.unlockedSkills?.length || 0}
          icon={Zap}
          formatValue={false}
        />
        <StatCard 
          title="Badges"
          value={user.badges?.length || 0}
          icon={TrendingUp}
          formatValue={false}
        />
      </div>
    </motion.div>
  )
}

export default UserProfile