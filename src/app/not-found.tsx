'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-DEFAULT/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-DEFAULT/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <div className="font-display text-9xl font-black bg-gradient-to-br from-cyan-DEFAULT via-violet-DEFAULT to-pink-DEFAULT bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Looks like you've ventured into uncharted territory. This page doesn't exist, but let's get you back on track.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/"
            className="btn-gradient px-8 py-3 rounded-xl font-semibold text-sm"
          >
            Back to Home
          </Link>
          
            <a
  href="#"
  onClick={() => window.history.back()}
  className="btn-neon-cyan px-8 py-3 rounded-xl font-semibold text-cyan-400 hover:text-cyan-300 transition"
>
  Go Back
</a>

        </motion.div>

        {/* Animated elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-12 text-6xl"
        >
          🚀
        </motion.div>
      </motion.div>
    </div>
  )
}