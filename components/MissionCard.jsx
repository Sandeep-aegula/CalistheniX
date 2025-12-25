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
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          isCompleted && 'border-secondary glow-secondary',
          canComplete && !isCompleted && 'border-primary glow-primary',
          'hover:border-opacity-80'
        )}
        glow={canComplete || isCompleted}
      >
        {/* Mission Type Badge */}
        <div className={cn(
          'absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-mono uppercase tracking-wider',
          getMissionTypeColor(mission.type)
        )}>
          {mission.type}
        </div>

        {/* Completion Status */}
        <div className="absolute top-4 left-4">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-secondary" />
          ) : canComplete ? (
            <motion.div
              className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
            />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
          )}
        </div>

        <Card.Header className="pt-12">
          <Card.Title className={cn(
            'text-lg flex items-center gap-2',
            isCompleted && 'text-secondary'
          )}>
            {mission.title}
            {mission.badgeReward && (
              <Trophy className="w-4 h-4 text-yellow-400" />
            )}
          </Card.Title>
          <Card.Description>
            {mission.description}
          </Card.Description>
        </Card.Header>

        <Card.Content className="space-y-4">
          {/* Mission Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mission Progress</span>
              <span className="font-mono">
                {completedRequirements}/{totalRequirements}
              </span>
            </div>
            <Progress 
              value={completedRequirements}
              max={totalRequirements}
              variant={isCompleted ? 'secondary' : 'primary'}
              animated={true}
            />
          </div>

          {/* Requirements List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
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
                      'flex items-center justify-between p-2 rounded-lg border',
                      isReqCompleted ? 
                        'border-secondary/50 bg-secondary/10' : 
                        'border-muted bg-muted/50'
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      {isReqCompleted ? (
                        <CheckCircle className="w-4 h-4 text-secondary" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={cn(
                        'text-sm',
                        isReqCompleted && 'line-through opacity-75'
                      )}>
                        {req.skillName}
                      </span>
                    </div>
                    
                    <span className={cn(
                      'text-xs font-mono',
                      isReqCompleted ? 'text-secondary' : 'text-muted-foreground'
                    )}>
                      {currentValue}/{req.targetValue} {req.unit}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">Rewards:</span>
            <div className="flex items-center gap-3">
              <span className="text-primary font-mono">+{mission.xpReward} XP</span>
              {mission.badgeReward && (
                <span className="text-yellow-400 text-xs">Badge: {mission.badgeReward}</span>
              )}
            </div>
          </div>
        </Card.Content>

        <Card.Footer>
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                className="w-full text-center text-secondary font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ✨ Mission Completed! ✨
              </motion.div>
            ) : canComplete ? (
              <Button
                key="complete"
                variant="cyber"
                onClick={handleComplete}
                isLoading={isCompleting}
                className="w-full"
              >
                Complete Mission
                <Trophy className="w-4 h-4 ml-2" />
              </Button>
            ) : userProgress ? (
              <Button
                key="continue"
                variant="outline"
                onClick={() => onStartMission?.(mission)}
                className="w-full"
              >
                Continue Mission
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                key="start"
                variant="primary"
                onClick={() => onStartMission?.(mission)}
                className="w-full"
              >
                Start Mission
                <ArrowRight className="w-4 h-4 ml-2" />
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