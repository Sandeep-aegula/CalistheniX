'use client'

import { motion } from 'framer-motion'
import { Lock, CheckCircle, Star, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDifficultyConfig } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'

const SkillCard = ({ 
  skill,
  isUnlocked = false,
  isCompleted = false,
  userProgress = null,
  onStartSkill,
  className,
  ...props 
}) => {
  const difficultyConfig = getDifficultyConfig(skill.difficulty)
  const progress = userProgress?.bestPerformance || null
  const progressPercentage = progress ? 
    Math.min((progress.reps / skill.targetReps) * 100, 100) : 0

  return (
    <motion.div
      className={cn('relative', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={isUnlocked ? { y: -4 } : {}}
      {...props}
    >
      <Card 
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          isUnlocked ? 'border-primary/50 hover:border-primary' : 'border-muted-foreground/30',
          isCompleted && 'border-secondary glow-secondary',
          !isUnlocked && 'opacity-60'
        )}
        hover={isUnlocked}
        glow={isCompleted}
      >
        {/* Skill Status Indicator */}
        <div className="absolute top-4 right-4">
          {!isUnlocked ? (
            <Lock className="w-5 h-5 text-muted-foreground" />
          ) : isCompleted ? (
            <CheckCircle className="w-5 h-5 text-secondary" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-primary/50" />
          )}
        </div>

        {/* Difficulty Badge */}
        <div className={cn(
          'absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-mono',
          difficultyConfig.bg,
          difficultyConfig.color
        )}>
          <div className="flex items-center gap-1">
            {Array.from({ length: skill.difficulty }, (_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-current" />
            ))}
          </div>
        </div>

        <Card.Header className="pt-12">
          <Card.Title className={cn(
            'text-lg',
            isUnlocked ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {skill.name}
          </Card.Title>
          <Card.Description>
            {skill.description}
          </Card.Description>
        </Card.Header>

        <Card.Content className="space-y-4">
          {/* Skill Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Target:</span>
              <div className="font-mono text-primary">
                {skill.targetReps} {skill.targetReps === 1 ? 'rep' : 'reps'}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">XP Reward:</span>
              <div className="font-mono text-secondary">+{skill.xpReward}</div>
            </div>
          </div>

          {/* Progress Bar for Unlocked Skills */}
          {isUnlocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Best Performance</span>
                <span className="font-mono">
                  {progress?.reps || 0}/{skill.targetReps}
                </span>
              </div>
              <Progress 
                value={progress?.reps || 0} 
                max={skill.targetReps}
                variant={isCompleted ? 'secondary' : 'primary'}
                animated={true}
              />
            </div>
          )}

          {/* Prerequisites */}
          {skill.prerequisites && skill.prerequisites.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Prerequisites:</span>
              <div className="flex flex-wrap gap-1">
                {skill.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card.Content>

        <Card.Footer>
          <Button
            variant={isCompleted ? 'secondary' : isUnlocked ? 'primary' : 'outline'}
            disabled={!isUnlocked}
            onClick={() => isUnlocked && onStartSkill?.(skill)}
            className="w-full"
          >
            {!isUnlocked ? (
              'Locked'
            ) : isCompleted ? (
              'Master this skill!'
            ) : (
              <>
                Start Training
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </Card.Footer>

        {/* Unlock Animation Overlay */}
        {isUnlocked && !isCompleted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, type: "tween" }}

          />
        )}

        {/* Mastery Glow for Completed Skills */}
        {isCompleted && (
          <motion.div
            className="absolute inset-0 bg-secondary/10 rounded-lg"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5, type: "tween" }}
          />
        )}
      </Card>
    </motion.div>
  )
}

export default SkillCard