'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const Button = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-sans font-bold lowercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden group shadow-sm'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
    secondary: 'bg-steel text-foreground border border-gray-300 hover:bg-gray-200',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-muted-foreground hover:text-primary hover:bg-primary/5',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    cyber: 'bg-bronze-gradient text-white shadow-lg hover:brightness-110 active:scale-95'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
    xl: 'px-10 py-5 text-lg rounded-2xl'
  }

  return (
    <motion.button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={disabled || isLoading ? {} : { y: -2 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      {...props}
    >
      {variant === 'cyber' && <span className="absolute inset-0 shine pointer-events-none opacity-50" />}
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <span className={cn('relative z-10 flex items-center gap-2', isLoading && 'opacity-0')}>
        {children}
      </span>
    </motion.button>
  )
}

export default Button
