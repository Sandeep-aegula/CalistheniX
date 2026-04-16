'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, Target, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'

const MissionCard = ({ 
  mission,
  userProgress = null,
  isCompleted: isCompletedProp,
  isActive = false,
  onStartMission,
  onCompleteMission,
  className,
  ...props 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  
  const isCompleted = isCompletedProp || userProgress?.isCompleted || false
  const progress = userProgress?.progress || []
  
  // Calculate overall mission progress
  const totalRequirements = mission.requirements.length
  const completedRequirements = progress.filter(p => p.completed).length
  const progressPercentage = totalRequirements > 0 ? 
    (completedRequirements / totalRequirements) * 100 : 0
  
  const canComplete = progressPercentage >= 100 && !isCompleted

  const getMissionTypeColor = (type) => {
    const colors = {
      daily: 'border-primary text-primary bg-primary/10',
      weekly: 'border-secondary text-secondary bg-secondary/10',
      monthly: 'border-purple-400 text-purple-400 bg-purple-400/10',
      special: 'border-orange-400 text-orange-400 bg-orange-400/10'
    }
    return colors[type] || colors.daily
  }

  const handleComplete = async () => {
    if (!canComplete) return
    
    setIsCompleting(true)
    try {
      await onCompleteMission?.(mission)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <motion.div
      className={cn('relative', className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      layout
      {...props}
    >
      <Card 
        variant="iron"
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          isCompleted && 'border-bronze glow-bronze',
          canComplete && !isCompleted && 'border-primary glow-primary',
          'border-white/5 hover:border-white/20'
        )}
        glow={canComplete || isCompleted}
      >
        {/* Mission Type Badge */}
        <div className={cn(
          'absolute top-4 right-4 px-2 py-1 rounded-sm text-[10px] font-black lowercase tracking-[0.3em]',
          getMissionTypeColor(mission.type)
        )}>
          {mission.type}
        </div>

        {/* Completion Status */}
        <div className="absolute top-4 left-4">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-bronze" />
          ) : canComplete ? (
            <motion.div
              className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
            />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-white/10" />
          )}
        </div>

        <Card.Header className="pt-12">
          <Card.Title className={cn(
            'text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2',
            isCompleted ? 'text-bronze' : 'text-white'
          )}>
            {mission.title}
            {mission.badgeReward && (
              <Trophy className="w-5 h-5 text-bronze" />
            )}
          </Card.Title>
          <Card.Description className="text-white/50 text-xs tracking-wide">
            {mission.description}
          </Card.Description>
        </Card.Header>

        <Card.Content className="space-y-6">
          {/* Mission Progress */}
          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between text-[10px] font-black lowercase tracking-widest text-white/40">
              <span>mission progress</span>
              <span className="font-mono text-primary">
                {completedRequirements}/{totalRequirements}
              </span>
            </div>
            <Progress 
              value={completedRequirements}
              max={totalRequirements}
              variant={isCompleted ? 'bronze' : 'primary'}
              animated={true}
            />
          </div>

          {/* Requirements List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Target className="w-3 h-3" />
              Requirements
            </h4>
            
            <div className="space-y-2">
              {mission.requirements.map((req, index) => {
                const reqProgress = progress.find(p => p.skillName === req.skillName)
                const isReqCompleted = reqProgress?.completed || false
                const currentValue = reqProgress?.currentValue || 0
                
                return (
                  <motion.div
                    key={index}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      isReqCompleted ? 
                        'border-bronze/50 bg-bronze/10' : 
                        'border-white/5 bg-white/5'
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      {isReqCompleted ? (
                        <CheckCircle className="w-4 h-4 text-bronze" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-white/20" />
                      )}
                      <span className={cn(
                        'text-xs font-black lowercase tracking-wider',
                        isReqCompleted ? 'line-through text-white/50' : 'text-white'
                      )}>
                        {req.skillName} - {req.targetValue} {req.unit === 'reps' ? 'Reps' : 'Sec'} x 3 Sets
                      </span>
                    </div>
                    
                    <span className={cn(
                      'text-[10px] font-mono font-bold tracking-widest',
                      isReqCompleted ? 'text-bronze' : 'text-primary'
                    )}>
                      {currentValue}/{req.targetValue} {req.unit}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
            <span className="text-[10px] font-black lowercase tracking-widest text-white/40">rewards:</span>
            <div className="flex items-center gap-3">
              <span className="text-bronze font-mono font-black text-lg">+{mission.xpReward} xp</span>
              {mission.badgeReward && (
                <span className="text-bronze text-[10px] font-black lowercase tracking-widest border border-bronze/30 px-2 py-1 rounded-sm bg-bronze/10">badge: {mission.badgeReward}</span>
              )}
            </div>
          </div>
        </Card.Content>

        <Card.Footer>
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                className="w-full text-center text-bronze font-black lowercase tracking-widest text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                protocol authorized ✨
              </motion.div>
            ) : canComplete ? (
              <Button
                key="complete"
                variant="cyber"
                onClick={handleComplete}
                isLoading={isCompleting}
                className="w-full font-black uppercase tracking-widest italic"
              >
                Authorize Completion
                <Trophy className="w-4 h-4 ml-2" />
              </Button>
            ) : isActive ? (
              <Button
                key="active"
                variant="outline"
                disabled
                className="w-full font-black uppercase tracking-widest border-white/10 text-white/40"
              >
                Protocol Active
                <Target className="w-4 h-4 ml-2" />
              </Button>
            ) : onStartMission ? (
              <Button
                key="start"
                variant="cyber"
                onClick={() => onStartMission?.(mission)}
                className="w-full font-black uppercase tracking-widest italic"
              >
                Initialize Protocol
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                key="unavailable"
                variant="outline"
                disabled
                className="w-full font-black uppercase tracking-widest border-white/10 text-white/40"
              >
                Protocol Locked
              </Button>
            )}
          </AnimatePresence>
        </Card.Footer>

        {/* Completion Animation Overlay */}
        {canComplete && !isCompleted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1, type: "tween" }}
          />
        )}
      </Card>
    </motion.div>
  )
}

export default MissionCard