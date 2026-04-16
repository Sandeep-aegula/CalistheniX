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
  onCompleteSkill,
  showMissionRequired = false,
  isRequiredForActiveMission = false,
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
        variant="iron"
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          isUnlocked ? 'border-primary/20 hover:border-primary/50' : 'border-white/5',
          isCompleted && 'border-bronze glow-bronze',
          !isUnlocked && 'opacity-60'
        )}
        hover={isUnlocked}
        glow={isCompleted}
      >
        {/* Skill Status Indicator */}
        <div className="absolute top-4 right-4">
           {!isUnlocked ? (
             <Lock className="w-5 h-5 text-white/20" />
           ) : isCompleted ? (
             <CheckCircle className="w-5 h-5 text-bronze" />
           ) : (
             <div className="w-5 h-5 rounded-full border-2 border-primary/50" />
           )}
        </div>

        {/* Difficulty Badge */}
        <div className={cn(
          'absolute top-4 left-4 px-2 py-1 rounded-sm text-[10px] font-black lowercase tracking-widest',
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
            'text-2xl font-black italic uppercase tracking-tighter',
            isUnlocked ? 'text-white' : 'text-white/40'
          )}>
            {skill.name}
          </Card.Title>
          <Card.Description className="text-white/60 text-xs tracking-wide">
            {skill.description}
          </Card.Description>
        </Card.Header>

        <Card.Content className="space-y-6">
          {/* Skill Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-black/40 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-[10px] font-black tracking-widest text-white/40 lowercase">target</span>
              <div className="font-mono text-primary font-bold">
                {skill.targetReps || 10} reps x 3 sets
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-white/40 lowercase">xp reward</span>
              <div className="font-mono text-bronze font-bold">+{skill.xpReward}</div>
            </div>
          </div>

          {/* Progress Bar for Unlocked Skills */}
          {isUnlocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black lowercase tracking-widest text-white/50">
                <span>best performance</span>
                <span className="font-mono text-primary">
                  {progress?.reps || 0}/{skill.targetReps}
                </span>
              </div>
              <Progress 
                value={progress?.reps || 0} 
                max={skill.targetReps}
                variant={isCompleted ? 'bronze' : 'primary'}
                animated={true}
              />
            </div>
          )}

          {/* Prerequisites */}
          {skill.prerequisites && skill.prerequisites.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-white/40 lowercase">prerequisites:</span>
              <div className="flex flex-wrap gap-2">
                {skill.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="text-[10px] px-2 py-1 bg-white/5 rounded-sm text-white/60 lowercase tracking-widest font-black"
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
            variant={isCompleted ? 'outline' : 
                    isRequiredForActiveMission ? 'primary' : 
                    isUnlocked ? 'cyber' : 'outline'}
            disabled={!isUnlocked || isCompleted}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              
              console.log('🔘 SkillCard Button clicked!', {
                skillName: skill.name,
                isUnlocked,
                isCompleted,
                disabled: !isUnlocked || isCompleted,
                hasOnCompleteSkill: !!onCompleteSkill,
                hasOnStartSkill: !!onStartSkill,
                event: 'clicked'
              })
              
              if (!isUnlocked) {
                console.log('❌ Skill not unlocked, cannot complete')
                return
              }
              
              if (isCompleted) {
                console.log('✅ Skill already completed')
                return
              }
              
              if (onCompleteSkill) {
                console.log('🎯 Calling onCompleteSkill for:', skill.name)
                onCompleteSkill(skill)
              } else if (onStartSkill) {
                console.log('🚀 Calling onStartSkill for:', skill.name)
                onStartSkill(skill)
              } else {
                console.log('❌ No completion handler available')
                alert('❌ No completion handler available. This might be a configuration issue.')
              }
            }}
            className={cn(
              'w-full',
              isRequiredForActiveMission && !isCompleted && 'animate-pulse'
            )}
          >
            {!isUnlocked ? (
              'Locked'
            ) : showMissionRequired ? (
              'Start a Mission First'
            ) : isCompleted ? (
              'Completed! ✅'
            ) : (
              <>
                Complete Skill
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </Card.Footer>

        {/* Unlock Animation Overlay */}
        {isUnlocked && !isCompleted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 pointer-events-none"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, type: "tween" }}
          />
        )}

        {/* Mastery Glow for Completed Skills */}
        {isCompleted && (
          <motion.div
            className="absolute inset-0 bg-secondary/10 rounded-lg pointer-events-none"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5, type: "tween" }}
          />
        )}
      </Card>
    </motion.div>
  )
}

export default SkillCard