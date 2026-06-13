'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  enabled: boolean
}

export default function SplashScreen({ enabled }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const seen = sessionStorage.getItem('splash_seen')
    if (!seen) {
      setShow(true)
      sessionStorage.setItem('splash_seen', '1')
      const t = setTimeout(() => setShow(false), 2800)
      return () => clearTimeout(t)
    }
  }, [enabled])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-primary"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="font-display text-5xl md:text-7xl font-black gradient-text-cyan tracking-widest uppercase">
              Lavanya Joshi
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-cyan-DEFAULT to-transparent mt-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-mono text-xs text-cyan-DEFAULT/60 uppercase tracking-[0.5em] mt-3"
            >
              Loading Portfolio...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}