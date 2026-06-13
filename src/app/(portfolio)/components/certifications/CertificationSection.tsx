'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import SectionWrapper from '../shared/SectionWrapper'
import { Certification } from '@/types'

interface Props {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: Props) {
  const [selected, setSelected] = useState<Certification | null>(null)

  if (!certifications.length) {
    return (
      <SectionWrapper id="certifications" title="Certifications">
        <p className="text-center text-slate-500">
          Certifications will appear here once added.
        </p>
      </SectionWrapper>
    )
  }

  const featured = certifications.filter(c => c.featured)
  const rest = certifications.filter(c => !c.featured)

  return (
    <SectionWrapper
      id="certifications"
      title="Certifications & Credentials"
      subtitle="Professional certifications and verified credentials"
      accentColor="violet"
    >
      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featured.map((cert, i) => (
              <CertCard
                key={cert._id}
                cert={cert}
                featured
                onClick={() => setSelected(cert)}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((cert, i) => (
          <CertCard
            key={cert._id}
            cert={cert}
            onClick={() => setSelected(cert)}
            index={i}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </SectionWrapper>
  )
}

function CertCard({
  cert,
  featured = false,
  onClick,
  index,
}: {
  cert: Certification
  featured?: boolean
  onClick: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-bg-tertiary ${featured ? 'h-48' : 'h-40'}`}>
        {cert.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-DEFAULT/10 to-pink-DEFAULT/10">
            <div className="text-5xl">🏆</div>
          </div>
        )}

        {featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs bg-violet-DEFAULT/20 text-violet-DEFAULT border border-violet-DEFAULT/30">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-100 group-hover:text-violet-DEFAULT transition-colors mb-1">
          {cert.title}
        </h3>
        <p className="text-sm text-slate-400 mb-3 flex-1">{cert.issuer}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {cert.skills?.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-mono"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          {cert.issueDate && <p>Issued: {cert.issueDate}</p>}
          {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
        </div>

        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mt-4 px-3 py-2 rounded-lg text-xs font-medium bg-violet-DEFAULT/20 text-violet-DEFAULT border border-violet-DEFAULT/30 hover:bg-violet-DEFAULT/30 transition-colors text-center"
          >
            View Credential
          </a>
        )}
      </div>
    </motion.div>
  )
}

function CertModal({ cert, onClose }: { cert: Certification; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="glass-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {cert.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100 flex-1">{cert.title}</h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-200 text-2xl leading-none ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>

          <p className="text-violet-DEFAULT font-semibold mb-2">{cert.issuer}</p>

          <div className="space-y-2 mb-4 text-sm text-slate-400">
            {cert.issueDate && <p>Issued: {cert.issueDate}</p>}
            {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
            {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
          </div>

          {cert.skills && cert.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-mono text-violet-DEFAULT mb-2 uppercase">
                Skills Verified
              </h4>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded text-xs bg-violet-DEFAULT/20 text-violet-DEFAULT border border-violet-DEFAULT/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-violet-DEFAULT/20 text-violet-DEFAULT border border-violet-DEFAULT/30 hover:bg-violet-DEFAULT/30 transition-colors text-center"
            >
              View Full Credential
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
