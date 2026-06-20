'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Project } from '@/types'
import { 
  Clock, 
  Users, 
  Github, 
  ExternalLink, 
  BookOpen, 
  PlayCircle,
  Cpu, 
  Layers,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Props {
  projects: Project[]
}

export default function ProjectsSection({ projects }: Props) {
  const [selected, setSelected] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')

  // Extract unique categories from projects dynamically
  const categories = useMemo(() => {
    const list = new Set<string>()
    projects.forEach((p) => {
      if (p.category) list.add(p.category)
    })
    return ['All', ...Array.from(list)]
  }, [projects])

  // Filter and sort projects: Featured first, then sortOrder
  const filteredProjects = useMemo(() => {
    let list = [...projects]
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory)
    }
    return list.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
      }
      return (a.sortOrder || 0) - (b.sortOrder || 0)
    })
  }, [projects, activeCategory])

  if (!projects.length) {
    return (
      <SectionWrapper id="projects" title="Projects">
        <p className="text-center text-slate-500 font-mono uppercase text-xs">No projects registered yet.</p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="A collection of things I've built — from web apps to AI experiments"
      accentColor="cyan"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 space-y-12">
        {/* Centered Pill Categories filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)] font-bold'
                    : 'border-slate-800 bg-[#0A1020]/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* 2-Column Responsive Showcase Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project
  index: number
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Cursor coordinates tracking for radial glow spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-[#0A1020]/70 backdrop-blur-md cursor-pointer select-none transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] flex flex-col h-full shadow-lg"
      style={{
        background: 'radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 229, 255, 0.06), transparent 40%)'
      } as any}
    >
      {/* Visual Thumbnail with Fallback and Error Handling */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0A0F1E] shrink-0 border-b border-slate-950">
        <img
          src={project.thumbnail?.image || "/placeholders/placeholder-project.png"}
          alt={project.thumbnail?.alt || project.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/placeholders/placeholder-project.png"
          }}
        />

        {/* Dynamic Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${
            project.status === 'completed' 
              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20' 
              : project.status === 'in_progress'
              ? 'bg-yellow-950/30 text-yellow-500 border-yellow-500/20'
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}>
            {project.status.replace('_', ' ')}
          </span>
          {project.featured && (
            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF4FD8]/15 text-[#FF4FD8] border border-[#FF4FD8]/30">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Card Content body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <span className="font-mono text-[9px] text-[#00E5FF] uppercase tracking-widest block">{project.category || 'AI Project'}</span>
          <h3 className="text-lg font-display font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-tight uppercase">
            {project.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Key Metrics block */}
          {project.keyMetrics && project.keyMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-950/40">
              {project.keyMetrics.slice(0, 3).map((metric, idx) => (
                <div key={idx} className="bg-[#0A1020]/45 border border-slate-900/60 rounded-lg p-2 text-center">
                  <span className="block text-sm md:text-base font-display font-extrabold text-[#00E5FF]">
                    {metric.value}
                  </span>
                  <span className="block text-[8px] font-mono text-slate-300 uppercase tracking-wide mt-1.5 whitespace-normal">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack Chips (no truncation, wrapping, high contrast) */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-950/40">
              {project.techStack.map((tech) => (
                <span 
                  key={tech} 
                  className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-[#00E5FF] px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider shadow-sm hover:bg-[#00E5FF]/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View Details Link */}
        <div className="flex items-center text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider group-hover:gap-1.5 transition-all select-none pt-3 border-t border-slate-950/40">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [slideIndex, setSlideIndex] = useState(0)

  // Quick helper to render custom markdown text paragraph nodes
  const renderMarkdown = (text?: string) => {
    if (!text) return null
    return text.split('\n').map((para, i) => {
      const trimmed = para.trim()
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={i} className="text-slate-400 text-xs ml-4 list-disc mt-1 leading-relaxed">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        )
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={i} className="text-white font-semibold text-xs uppercase tracking-wider mt-4 mb-1.5 font-mono">
            {trimmed.replace(/^###\s+/, '')}
          </h4>
        )
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={i} className="text-slate-100 font-bold text-sm uppercase tracking-wide mt-5 mb-2 font-display">
            {trimmed.replace(/^##\s+/, '')}
          </h3>
        )
      }
      if (trimmed === '') {
        return <div key={i} className="h-1.5" />
      }
      return (
        <p key={i} className="text-slate-400 text-xs leading-relaxed mt-2 font-sans">
          {para}
        </p>
      )
    })
  }

  // Handle slide next/prev
  const handleNextSlide = () => {
    if (!project.gallery) return
    setSlideIndex((prev) => (prev + 1) % project.gallery!.length)
  }

  const handlePrevSlide = () => {
    if (!project.gallery) return
    setSlideIndex((prev) => (prev - 1 + project.gallery!.length) % project.gallery!.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#030712] border border-[#00E5FF]/20 rounded-2xl max-w-4xl w-full my-8 text-slate-200 overflow-hidden relative shadow-2xl shadow-[#00E5FF]/10 flex flex-col max-h-[90vh]"
      >
        {/* Cover Thumbnail Image with Fallback and Error Handling */}
        <div className="relative h-56 md:h-64 w-full bg-[#0A0F1E] shrink-0 border-b border-slate-950 overflow-hidden">
          <img
            src={project.thumbnail?.image || "/placeholders/placeholder-project.png"}
            alt={project.thumbnail?.alt || project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholders/placeholder-project.png"
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-emerald-950/45 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
              {project.status}
            </span>
            {project.featured && (
              <span className="bg-[#FF4FD8]/25 text-[#FF4FD8] border border-[#FF4FD8]/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                Featured
              </span>
            )}
            {project.isCaseStudy && (
              <span className="bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                Case Study
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-900/60 hover:bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center text-lg transition-all"
          >
            ×
          </button>
        </div>

        {/* Scroll Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Header Metadata */}
          <div className="border-b border-slate-950 pb-5 space-y-2">
            <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-widest block">{project.category || 'AI Showcase'}</span>
            <h2 className="text-xl md:text-3xl font-display font-bold text-white uppercase tracking-wide">
              {project.title}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans pt-1">
              {project.shortDescription}
            </p>

            {/* Metadata tags */}
            <div className="flex gap-6 mt-4 font-mono text-[9px] uppercase text-slate-500">
              {project.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Duration:</span>
                  <span className="text-slate-300 font-semibold">{project.duration}</span>
                </div>
              )}
              {project.teamSize && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  <span>Team Size:</span>
                  <span className="text-slate-300 font-semibold">{project.teamSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics Dashboard (High Contrast labels) */}
          {project.keyMetrics && project.keyMetrics.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Performance Impact Metrics</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.keyMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-[#0A1020]/60 border border-slate-900 rounded-xl p-4 text-center">
                    <span className="block text-2xl md:text-3xl font-display font-extrabold bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] bg-clip-text text-transparent">
                      {metric.value}
                    </span>
                    <span className="block text-[9px] font-mono text-slate-350 uppercase tracking-wider mt-1.5">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Study Grid Blocks (Omit if empty) */}
          {(project.problemStatement || project.solution || project.challenges || project.outcomes) && (
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-950 pb-2">
                Case Study Deep Dive
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {project.problemStatement && (
                  <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">The Problem</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{project.problemStatement}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Intelligent Solution</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{project.solution}</p>
                  </div>
                )}
                {project.challenges && (
                  <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Technical Challenges</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{project.challenges}</p>
                  </div>
                )}
                {project.outcomes && (
                  <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Impact & Outcomes</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{project.outcomes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Highlights checklist */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Accomplishment Checklist</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                {project.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-[#090F1E]/20 p-3 rounded-lg border border-slate-950 leading-relaxed">
                    <span className="text-[#00E5FF] font-mono shrink-0 select-none">✔</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Documentation Markdown text */}
          {project.fullDescription && (
            <div className="space-y-3 border-t border-slate-950 pt-6">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Technical Walkthrough</h4>
              <div className="prose prose-invert max-w-none prose-xs font-sans">
                {renderMarkdown(project.fullDescription)}
              </div>
            </div>
          )}

          {/* Gallery Carousel with Fallback and Error Handling */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-3 border-t border-slate-950 pt-6">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Project gallery</h4>
              
              <div className="relative bg-slate-950 border border-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center max-w-2xl mx-auto">
                <img
                  src={project.gallery[slideIndex].image || "/placeholders/placeholder-project.png"}
                  alt={project.gallery[slideIndex].alt || `Gallery screenshot ${slideIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholders/placeholder-project.png"
                  }}
                />
                
                {/* Alt Overlay */}
                {project.gallery[slideIndex].alt && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs p-3 text-[10px] text-slate-400 border-t border-slate-900 text-center font-mono">
                    {project.gallery[slideIndex].alt}
                  </div>
                )}

                {/* Left/Right Controls */}
                {project.gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-950 text-white rounded-full w-8 h-8 flex items-center justify-center border border-slate-800 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-950 text-white rounded-full w-8 h-8 flex items-center justify-center border border-slate-800 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="text-center font-mono text-[9px] text-slate-500 uppercase">
                Image {slideIndex + 1} of {project.gallery.length}
              </div>
            </div>
          )}

          {/* Architecture Diagram Section (Conditional render) */}
          {project.architectureDiagram && (
            <div className="space-y-3 border-t border-slate-950 pt-6">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF4FD8]" />
                <span>System Architecture Diagram</span>
              </h4>
              <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 p-4 flex justify-center max-w-2xl mx-auto">
                <img
                  src={project.architectureDiagram}
                  alt="System design flow diagram"
                  className="max-h-80 object-contain"
                />
              </div>
            </div>
          )}

          {/* Technologies used & tags (High Contrast) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-950 pt-6">
            {project.techStack && project.techStack.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Technologies Ecosystem</h5>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech} 
                      className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-[#00E5FF] px-2.5 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Project tags</h5>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-slate-950 border border-slate-900 text-slate-500 px-2.5 py-0.5 rounded font-mono text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal CTA Action Bar (Sticky footer style) */}
        <div className="bg-[#050814] border-t border-slate-950 p-5 flex flex-wrap gap-3 items-center justify-end shrink-0">
          {project.githubUrl && project.showGithub !== false && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-slate-800 hover:border-[#00E5FF] hover:text-[#00E5FF] text-slate-350 font-mono text-xs uppercase py-2 px-4 rounded-lg tracking-wider transition-all flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Code</span>
            </a>
          )}
          {project.demoUrl && project.showDemo !== false && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:opacity-90 text-white font-mono text-xs uppercase py-2.5 px-5 rounded-lg tracking-wider transition-all shadow-md flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
          {project.documentationUrl && project.showDocumentation !== false && (
            <a
              href={project.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-slate-800 hover:border-slate-400 text-slate-350 font-mono text-xs uppercase py-2 px-4 rounded-lg tracking-wider transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </a>
          )}
          {project.videoDemoUrl && project.showVideoDemo !== false && (
            <a
              href={project.videoDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-slate-800 hover:border-[#FF4FD8] hover:text-[#FF4FD8] text-[#FF4FD8] hover:bg-[#FF4FD8]/5 font-mono text-xs uppercase py-2 px-4 rounded-lg tracking-wider transition-all flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Watch Video</span>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}