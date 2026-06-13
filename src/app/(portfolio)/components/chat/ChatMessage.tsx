import { motion } from 'framer-motion'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isUser
            ? 'bg-cyan-DEFAULT/20 text-slate-200 border border-cyan-DEFAULT/30'
            : 'bg-slate-800/50 text-slate-300 border border-slate-700/30'
        }`}
      >
        {content}
      </div>
    </motion.div>
  )
}
