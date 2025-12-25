'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Shield, Flame, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRarityConfig } from '@/lib/utils'

const iconMap = {
  trophy: Trophy,
  star: Star,
  shield: Shield,
  flame: Flame,
  crown: Crown,
}

const Badge = ({ 
  name,
  description,
  icon = 'trophy',
  rarity = 'common',
  earned = false,
  earnedAt,
  size = 'md',
  showDetails = true,
  className,
  ...props 
}) => {
  const IconComponent = iconMap[icon] || Trophy
  const rarityConfig = getRarityConfig(rarity)
  
  const sizes = {
    sm: 'w-8 h-8 p-1',
    md: 'w-12 h-12 p-2',
    lg: 'w-16 h-16 p-3',
    xl: 'w-20 h-20 p-4'
  }
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center space-y-2',
        className
      )}
      whileHover={earned ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {/* Badge Icon */}
      <motion.div
        className={cn(
          'relative rounded-full border-2 flex items-center justify-center transition-all duration-300',
          sizes[size],
          earned ? [
            rarityConfig.bg,
            'border-current',
            rarityConfig.color,
            `shadow-lg ${rarityConfig.glow}`
          ] : [
            'bg-muted border-muted-foreground/30 text-muted-foreground'
          ]
        )}
        initial={earned ? { rotate: 0 } : {}}
        animate={earned ? { rotate: 5 } : {}}
        transition={earned ? { 
          duration: 0.6, 
          delay: 0.2,
          type: "spring",
          stiffness: 300 
        } : {}}
      >
        <IconComponent className={cn(
          'transition-all duration-300',
          size === 'sm' ? 'w-4 h-4' : 
          size === 'md' ? 'w-6 h-6' :
          size === 'lg' ? 'w-8 h-8' : 'w-10 h-10',
          !earned && 'opacity-30'
        )} />
        
        {/* Sparkle effect for earned badges */}
        {earned && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-secondary rounded-full"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1 -left-2 w-1 h-1 bg-accent rounded-full"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </>
        )}
      </motion.div>
      
      {/* Badge Details */}
      {showDetails && (
        <div className="text-center space-y-1">
          <h4 className={cn(
            'font-bold',
            textSizes[size],
            earned ? rarityConfig.color : 'text-muted-foreground'
          )}>
            {name}
          </h4>
          
          {description && (
            <p className={cn(
              'text-muted-foreground leading-tight max-w-32',
              textSizes[size] === 'text-xs' ? 'text-xs' : 'text-xs'
            )}>
              {description}
            </p>
          )}
          
          <div className={cn(
            'text-xs font-mono uppercase tracking-wide',
            earned ? rarityConfig.color : 'text-muted-foreground/50'
          )}>
            {rarityConfig.label}
          </div>
          
          {earned && earnedAt && (
            <div className="text-xs text-muted-foreground">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default Badge