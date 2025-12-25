'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const Card = ({ 
  children, 
  className,
  hover = false,
  glow = false,
  gradient = false,
  ...props 
}) => {
  const baseClasses = 'bg-card border border-border rounded-lg p-6 shadow-lg'
  
  return (
    <motion.div
      className={cn(
        baseClasses,
        hover && 'cursor-pointer',
        glow && 'glow-primary',
        gradient && 'bg-gradient-to-br from-card via-card to-muted',
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
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