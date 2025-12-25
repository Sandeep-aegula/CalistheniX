'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const Progress = ({ 
  value = 0, 
  max = 100,
  className,
  showValue = false,
  label,
  animated = true,
  variant = 'primary',
  ...props 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    destructive: 'bg-destructive',
    gradient: 'bg-gradient-to-r from-primary to-secondary'
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showValue && (
            <span className="text-sm font-mono text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variants[variant]
          )}
          initial={{ width: 0 }}
          animate={animated ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          style={!animated ? { width: `${percentage}%` } : {}}
        />
        
        {/* Animated shimmer effect */}
        {percentage > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '400%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Progress