'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function ContactSection({ profile }: Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'contact_form',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to send message')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('An error occurred. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SectionWrapper
      id="contact"
      title="Get In Touch"
      subtitle="Have a project in mind or just want to chat? Feel free to reach out!"
      accentColor="pink"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1280px] mx-auto">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-semibold text-slate-100">
            Let's collaborate
          </h3>

          <p className="text-slate-400 leading-relaxed">
            Whether you have a project proposal, want to discuss AI & machine learning, or just want to say hello — I'd love to hear from you!
          </p>

          {/* Contact methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-4">
            {profile?.email && (
              <ContactMethod
                icon="✉️"
                label="Email"
                value={profile.email.trim()}
                href={`mailto:${profile.email.trim()}`}
              />
            )}
            {profile?.location && (
              <ContactMethod
                icon="📍"
                label="Location"
                value={profile.location.trim()}
                href="#"
              />
            )}
            {profile?.socialLinks?.linkedin && (
              <ContactMethod
                icon="💼"
                label="LinkedIn"
                value={profile.socialLinks.linkedin.trim().replace(/^https?:\/\/(www\.)?/, '')}
                href={profile.socialLinks.linkedin.trim()}
              />
            )}
            {profile?.socialLinks?.github && (
              <ContactMethod
                icon="🐙"
                label="GitHub"
                value={profile.socialLinks.github.trim().replace(/^https?:\/\/(www\.)?/, '')}
                href={profile.socialLinks.github.trim()}
              />
            )}
            {profile?.socialLinks?.twitter && (
              <ContactMethod
                icon="🐦"
                label="Twitter"
                value={profile.socialLinks.twitter.trim().replace(/^https?:\/\/(www\.)?/, '')}
                href={profile.socialLinks.twitter.trim()}
              />
            )}
            {profile?.socialLinks?.website && (
              <ContactMethod
                icon="🌐"
                label="Website"
                value={profile.socialLinks.website.trim().replace(/^https?:\/\/(www\.)?/, '')}
                href={profile.socialLinks.website.trim()}
              />
            )}
            {profile?.socialLinks?.phone && (
              <ContactMethod
                icon="📞"
                label="Phone"
                value={profile.socialLinks.phone.trim()}
                href={`tel:${profile.socialLinks.phone.trim()}`}
              />
            )}
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="futuristic-input w-full px-4 py-3 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-pink-DEFAULT/50"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="futuristic-input w-full px-4 py-3 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-pink-DEFAULT/50"
                placeholder="you@example.com"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="futuristic-input w-full px-4 py-3 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-pink-DEFAULT/50 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-sm"
              >
                ✓ Message sent successfully! I'll get back to you soon.
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm"
              >
                ✗ {errorMessage}
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gradient px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              I respect your privacy. Your information will only be used to contact you back.
            </p>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}

function ContactMethod({
  icon,
  label,
  value,
  href,
}: {
  icon: string
  label: string
  value: string
  href: string
}) {
  const trimmedHref = href.trim()
  const isExternal = trimmedHref.startsWith('http') || trimmedHref.startsWith('mailto:')
  return (
    <a href={trimmedHref}
       target={isExternal ? "_blank" : undefined}
       rel={isExternal ? "noopener noreferrer" : undefined}
       className="flex items-start gap-4 p-4 rounded-3xl glass-card hover:border-pink-DEFAULT/30 transition-all duration-300 group">

      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-mono uppercase">{label}</p>
        <p className="text-slate-200 group-hover:text-pink-DEFAULT transition-colors break-all">
          {value.trim()}
        </p>
      </div>
      <span className="text-slate-500 group-hover:text-pink-DEFAULT transition-colors">→</span>
    </a>
  )
}