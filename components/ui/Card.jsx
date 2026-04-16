'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const Card = ({ 
  children, 
  className, 
  hover = true,
  animate = false,
  variant = 'iron',
  glow = false,
  glowColor = 'primary',
  ...props 
}) => {
  return (
    <motion.div
      className={cn(
        'relative rounded-3xl overflow-hidden p-6 transition-all duration-300',
        variant === 'iron' ? 'iron-card' : 'glass-panel',
        animate && 'shine',
        'border border-white/5',
        className
      )}
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Subtle metallic reflection for Iron cards */}
      {variant === 'iron' && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </motion.div>
  )
}


const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-xl font-bold tracking-tight text-card-foreground', className)} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
)

const CardContent = ({ children, className, ...props }) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('flex items-center pt-4', className)} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card