'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Target, 
  Trophy, 
  BarChart3, 
  Settings, 
  User,
  Menu,
  X,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const Navigation = ({ currentPage = 'dashboard', onPageChange }) => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'missions', label: 'Missions', icon: Zap },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleNavigation = (pageId) => {
    onPageChange?.(pageId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-45 shadow-lg",
          "md:translate-x-0 md:block",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <motion.h1 
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              CalistheniX
            </motion.h1>
            <p className="text-xs text-muted-foreground mt-1">Game of Gains</p>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user.name || session.user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Level {session.user.level || 1}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <li key={item.id}>
                    <motion.button
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                        isActive ? [
                          "bg-primary text-primary-foreground font-semibold",
                          "shadow-lg glow-primary"
                        ] : [
                          "text-muted-foreground hover:text-foreground",
                          "hover:bg-muted"
                        ]
                      )}
                      onClick={() => handleNavigation(item.id)}
                      whileHover={!isActive ? { x: 4 } : {}}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </motion.button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Version 1.0.0
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Built with 💪 for athletes
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <motion.button
                key={item.id}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => handleNavigation(item.id)}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Navigation