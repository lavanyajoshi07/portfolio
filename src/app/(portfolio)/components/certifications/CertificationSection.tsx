'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import SectionWrapper from '../shared/SectionWrapper'
import { Certification } from '@/types'
import IssuerLogo from '@/components/IssuerLogo'

interface Props {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: Props) {
  const [selected, setSelected] = useState<Certification | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null | undefined>(null)
  const [showLightbox, setShowLightbox] = useState(false)

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
                onViewCertificate={(c) => {
                  setLightboxImage(c.certificateImage)
                  setShowLightbox(true)
                }}
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
            onViewCertificate={(c) => {
              setLightboxImage(c.certificateImage)
              setShowLightbox(true)
            }}
            index={i}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <CertModal
            cert={selected}
            onClose={() => setSelected(null)}
            onViewCertificate={(c) => {
              setLightboxImage(c.certificateImage)
              setShowLightbox(true)
            }}
          />
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <CertificateLightbox
            imageUrl={lightboxImage || null}
            onClose={() => {
              setShowLightbox(false)
              setLightboxImage(null)
            }}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

function CertCard({
  cert,
  featured = false,
  onClick,
  onViewCertificate,
  index,
}: {
  cert: Certification
  featured?: boolean
  onClick: () => void
  onViewCertificate: (cert: Certification) => void
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
      {/* Image / Issuer Logo */}
      <div className={`relative overflow-hidden bg-bg-tertiary ${featured ? 'h-48' : 'h-40'} flex items-center justify-center p-4`}>
        <IssuerLogo issuer={cert.issuer} className="w-full h-full" />

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

        <div className="mt-4 flex flex-col gap-2">
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-violet-DEFAULT/20 text-violet-DEFAULT border border-violet-DEFAULT/30 hover:bg-violet-DEFAULT/30 transition-colors text-center"
            >
              View Credential
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewCertificate(cert)
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-cyan-DEFAULT/20 text-cyan-DEFAULT border border-cyan-DEFAULT/30 hover:bg-cyan-DEFAULT/30 transition-colors text-center"
          >
            View Certificate
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CertModal({
  cert,
  onClose,
  onViewCertificate,
}: {
  cert: Certification
  onClose: () => void
  onViewCertificate: (cert: Certification) => void
}) {
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
        <div className="relative h-48 w-full bg-bg-tertiary flex items-center justify-center p-4 rounded-t-2xl">
          <IssuerLogo issuer={cert.issuer} className="w-full h-full" />
        </div>

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

          <div className="flex flex-col gap-2">
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
            <button
              onClick={() => onViewCertificate(cert)}
              className="block w-full px-4 py-2 rounded-lg text-sm font-medium bg-cyan-DEFAULT/20 text-cyan-DEFAULT border border-cyan-DEFAULT/30 hover:bg-cyan-DEFAULT/30 transition-colors text-center"
            >
              View Certificate Scan
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CertificateLightbox({
  imageUrl,
  onClose,
}: {
  imageUrl: string | null
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-2xl max-w-2xl w-full p-6 text-slate-200 border border-[#00E5FF]/20 relative cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 text-2xl leading-none"
        >
          ×
        </button>

        <div className="text-center">
          <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider mb-4">
            Certificate Scan
          </h3>

          {imageUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-black max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Certificate Scan"
                className="max-h-[60vh] w-auto object-contain mx-auto"
              />
            </div>
          ) : (
            <div className="py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/50 flex flex-col items-center justify-center space-y-3">
              <div className="text-4xl text-amber-500">⚠️</div>
              <p className="font-mono text-sm text-slate-400">
                No certificate image available
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
