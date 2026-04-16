'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Target, 
  Trophy, 
  BarChart3, 
  Settings, 
  User,
  Zap,
  Dumbbell,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Navigation = ({ currentPage = 'dashboard', onPageChange }) => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
    { id: 'skills', label: 'skill tree', icon: Target },
    { id: 'missions', label: 'protocol', icon: Zap },
    { id: 'achievements', label: 'vault', icon: Trophy },
    { id: 'progress', label: 'telemetry', icon: BarChart3 },
    { id: 'profile', label: 'athlete', icon: User },
    { id: 'settings', label: 'system', icon: Settings },
  ]

  const handleNavigation = (pageId) => {
    onPageChange?.(pageId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:block fixed left-0 top-0 h-full w-64 steel-texture border-r border-gray-300 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.05)]"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 border-b border-gray-300">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-lg bg-iron flex items-center justify-center shadow-md">
                <Dumbbell className="w-5 h-5 text-bronze" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                CALI<span className="text-bronze">STHENIX</span>
              </h1>
            </motion.div>
            <p className="text-[10px] text-muted-foreground lowercase tracking-[0.3em] font-bold mt-2 ml-11">
              elite v3.0
            </p>
          </div>

          {/* User Status Bar */}
          {session?.user && (
            <div className="p-4 mx-4 my-6 rounded-2xl bg-iron shadow-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name}
                      className="w-10 h-10 rounded-xl border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-inner">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-bronze rounded-full border-2 border-iron flex items-center justify-center text-[8px] font-bold text-white">
                    {session.user.level || 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white lowercase tracking-tight truncate">
                    {session.user.name || session.user.username}
                  </p>
                  <div className="h-1 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary w-2/3 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <li key={item.id}>
                    <button
                      className={cn(
                        "group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 relative overflow-hidden",
                        isActive ? [
                          "bg-primary text-white font-bold shadow-lg shadow-primary/20",
                        ] : [
                          "text-muted-foreground hover:text-black hover:bg-black/5",
                        ]
                      )}
                      onClick={() => handleNavigation(item.id)}
                    >
                      {isActive && <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-white" />}
                      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400")} />
                      <span className="text-xs lowercase tracking-[0.15em] font-black">{item.label}</span>
                      
                      {isActive && <div className="absolute inset-0 shine opacity-20" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer Profile Toggle */}
          <div className="p-6 border-t border-gray-300">
            <div className="flex items-center justify-between text-[10px] font-bold lowercase tracking-widest text-muted-foreground/60">
              <span>status: online</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-iron rounded-2xl shadow-2xl z-50 border border-white/10 px-4 flex items-center justify-between">
         {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                className={cn(
                  "p-3 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary text-white shadow-lg" : "text-white/40"
                )}
                onClick={() => handleNavigation(item.id)}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
         })}
      </div>
    </>
  )
}

export default Navigation