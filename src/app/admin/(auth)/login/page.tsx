'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Terminal, AlertTriangle, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error || 'Invalid credentials')
      } else {
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card border border-[#00E5FF]/20 bg-[#0A1020]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative neon linear top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#FF4FD8]" />

      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] p-0.5 flex items-center justify-center mb-3 shadow-lg shadow-[#00E5FF]/20">
          <div className="w-full h-full rounded-[10px] bg-[#0A1020] flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#00E5FF]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold font-display text-white tracking-wide uppercase">
          Workspace Access
        </h1>
        <p className="text-xs font-mono text-[#00E5FF] mt-1 tracking-widest uppercase">
          SECURE PROTOCOL REQUIRED
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex items-center gap-3 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-sm"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="font-mono text-xs text-slate-400 uppercase tracking-wider">
            Access Key (Password)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-[#101827]/70 border-slate-800 text-white placeholder-slate-600 focus:border-[#00E5FF]/50 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-[#00E5FF] hover:to-[#FF4FD8] text-white font-mono uppercase tracking-wider shadow-lg shadow-[#00E5FF]/10 transition-all duration-300 relative overflow-hidden py-6 text-sm"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Decrypting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Initialize Terminal</span>
            </div>
          )}
        </Button>
      </form>
    </motion.div>
  )
}
