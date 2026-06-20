'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import SectionWrapper from '../shared/SectionWrapper'
import { Faq } from '@/types'

interface Props {
  faqs: Faq[]
}

export default function FaqsSection({ faqs }: Props) {
  const activeFaqs = faqs
    .filter((f) => f.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (!activeFaqs.length) return null

  return (
    <SectionWrapper
      id="faqs"
      title="Frequently Asked Questions"
      subtitle="Quick reference details and answers to common integration queries"
      accentColor="violet"
    >
      <div className="max-w-3xl mx-auto space-y-3">
        {activeFaqs.map((faq, idx) => {
          const isExpanded = expandedIndex === idx

          return (
            <div
              key={faq._id || idx}
              className="glass-card rounded-3xl border border-cyan-500/10 overflow-hidden bg-[#0A1020]/70 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between p-4 font-display font-semibold text-sm text-left text-slate-200 hover:text-white transition-colors gap-4"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-4 pt-1 text-xs md:text-sm text-slate-400 leading-relaxed font-sans border-t border-slate-900/60 bg-slate-950/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
