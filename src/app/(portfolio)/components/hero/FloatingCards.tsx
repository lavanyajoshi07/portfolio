'use client'

import { motion } from 'framer-motion'
import { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function FloatingCards({ profile }: Props) {
  const cards = [
    {
      label: 'Years Learning',
      value: profile?.yearsOfExperience ? `${profile.yearsOfExperience}+` : '1+',
      icon: '🎓',
      position: '-top-8 -left-16',
      delay: 0.5,
      color: 'cyan',
    },
    {
      label: 'Projects Built',
      value: '10+',
      icon: '🚀',
      position: '-bottom-8 -right-16',
      delay: 0.7,
      color: 'pink',
    },
    {
      label: 'Problems Solved',
      value: '200+',
      icon: '⚡',
      position: 'top-1/2 -right-20',
      delay: 0.9,
      color: 'violet',
    },
  ]

  return (
    <>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: card.delay }}
          className={`absolute ${card.position} hidden xl:block`}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            className="glass-card rounded-xl p-3 min-w-[130px]"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{card.icon}</span>
              <div>
                <p className={`text-xl font-bold font-display ${
                  card.color === 'cyan' ? 'text-cyan-DEFAULT' :
                  card.color === 'pink' ? 'text-pink-DEFAULT' : 'text-violet-DEFAULT'
                }`}>
                  {card.value}
                </p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
            {/* Glow dot */}
            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
              card.color === 'cyan' ? 'bg-cyan-DEFAULT' :
              card.color === 'pink' ? 'bg-pink-DEFAULT' : 'bg-violet-DEFAULT'
            } animate-pulse`} />
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}