'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TranscriptEntry } from '@/types'

interface Props {
  src: string
  transcript: TranscriptEntry[]
  onClose: () => void
}

export default function AudioPlayer({ src, transcript, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      const entry = transcript.find(
        t => audio.currentTime >= t.startTime && audio.currentTime < t.endTime
      )
      if (entry) setCurrentText(entry.text)
    }

    const onLoaded = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)

    audio.play().then(() => setIsPlaying(true)).catch(() => {})

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
    }
  }, [transcript])

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]"
    >
      <audio ref={audioRef} src={src} className="hidden" />
      
      {/* Header & Close */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Now Playing</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      {/* Text */}
      <p className="text-xs text-slate-300 h-8 mb-3 overflow-hidden">{currentText}</p>

      {/* Progress & Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            const audio = audioRef.current;
            if(isPlaying) { audio?.pause(); setIsPlaying(false); }
            else { audio?.play(); setIsPlaying(true); }
          }}
          className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <input 
          type="range" 
          value={currentTime} 
          max={duration || 100} 
          onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = Number(e.target.value) }}
          className="flex-1 h-1 bg-slate-700 rounded-full appearance-none accent-cyan-500"
        />
      </div>
    </motion.div>
  )
}