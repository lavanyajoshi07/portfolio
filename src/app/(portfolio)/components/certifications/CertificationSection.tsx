'use client'

import { motion } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Certification } from '@/types'
import IssuerLogo from '@/components/IssuerLogo'
import { Eye, ExternalLink } from 'lucide-react'

interface Props {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: Props) {
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
      <div className="space-y-8">
        {/* Featured */}
        {featured.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((cert, i) => (
                <CertCard
                  key={cert._id}
                  cert={cert}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((cert, i) => (
              <CertCard
                key={cert._id}
                cert={cert}
                index={i + featured.length}
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

function CertCard({
  cert,
  index,
}: {
  cert: Certification
  index: number
}) {
  const credentialLinkToUse = cert.credentialLink || cert.credentialUrl
  const showCredentialButton = !!(cert.showCredential && credentialLinkToUse)
  const hasCTAs = !!(cert.certificateUrl || showCredentialButton)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="glass-card rounded-3xl bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur p-6 flex flex-col justify-between min-h-[300px] max-h-[360px] h-[330px] hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300 group"
    >
      {/* Top + Middle Wrapper */}
      <div className="flex flex-col space-y-4 min-h-0 flex-1">
        {/* Top: Logo & Featured */}
        <div className="flex items-start justify-between gap-4 shrink-0">
          <IssuerLogo
            issuer={cert.issuer}
            logoMode={cert.logoMode}
            logo={cert.logo}
            logoAlt={cert.logoAlt}
            className="w-16 h-16 shrink-0"
          />
          {cert.featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/25 shadow-[0_0_8px_rgba(124,58,237,0.1)] select-none shrink-0 mt-1">
              Featured
            </span>
          )}
        </div>

        {/* Title & Issuer */}
        <div className="space-y-1 shrink-0">
          <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2" title={cert.title}>
            {cert.title}
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            {cert.issuer}
          </p>
        </div>

        {/* Middle: Tags */}
        {cert.tags && cert.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 overflow-hidden py-1">
            {cert.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-xl bg-slate-900/80 text-slate-300 font-mono text-xs border border-slate-800/80 shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom: CTAs */}
      {hasCTAs && (
        <div className="flex gap-2 pt-4 border-t border-slate-950/40 shrink-0">
          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 text-center"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Certificate</span>
            </a>
          )}
          {showCredentialButton && (
            <a
              href={credentialLinkToUse}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all duration-300 text-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Credential</span>
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

