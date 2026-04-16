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
        'flex flex-col items-center space-y-4',
        className
      )}
      whileHover={earned ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {/* Badge Icon */}
      <motion.div
        className={cn(
          'relative rounded-xl border-4 flex items-center justify-center transition-all duration-300',
          sizes[size],
          earned ? [
            'bg-iron border-iron',
            rarityConfig.color,
            `shadow-[0_0_20px_rgba(205,127,50,0.3)] rotate-3`
          ] : [
            'bg-black/50 border-white/5 text-white/20'
          ]
        )}
        initial={earned ? { rotate: 0 } : {}}
        animate={earned ? { rotate: 3 } : {}}
        transition={earned ? { 
          duration: 0.6, 
          delay: 0.2,
          type: "spring",
          stiffness: 300 
        } : {}}
      >
        <div className="-rotate-3 flex flex-col items-center justify-center">
          <IconComponent className={cn(
            'transition-all duration-300 drop-shadow-md',
            size === 'sm' ? 'w-4 h-4' : 
            size === 'md' ? 'w-6 h-6' :
            size === 'lg' ? 'w-8 h-8' : 'w-10 h-10',
            !earned && 'opacity-30'
          )} />
        </div>
        
        {/* Sparkle effect for earned badges */}
        {earned && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-1 -left-2 w-1 h-1 bg-bronze rounded-full shadow-[0_0_10px_rgba(205,127,50,0.8)]"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
             <motion.div
              className="absolute inset-0 rounded-xl border border-white/10"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
            />
          </>
        )}
      </motion.div>
      
      {/* Badge Details */}
      {showDetails && (
        <div className="text-center space-y-2">
          <h4 className={cn(
            'font-black italic uppercase tracking-tighter',
            textSizes[size],
            earned ? 'text-white' : 'text-white/40'
          )}>
            {name}
          </h4>
          
          <div className={cn(
            'text-[10px] font-black lowercase tracking-[0.2em]',
            earned ? rarityConfig.color : 'text-white/30'
          )}>
            {rarityConfig.label}
          </div>

          {description && (
            <p className={cn(
              'text-white/50 leading-tight max-w-32 mx-auto font-bold tracking-widest lowercase text-[8px]'
            )}>
              {description}
            </p>
          )}
          
          {earned && earnedAt && (
            <div className="text-[10px] font-mono text-primary font-bold lowercase">
              authorized {new Date(earnedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default Badge