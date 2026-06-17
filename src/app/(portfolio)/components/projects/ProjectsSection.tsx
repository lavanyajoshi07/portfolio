'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Project } from '@/types'

interface Props {
  projects: Project[]
}

export default function ProjectsSection({ projects }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))]

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchesFilter = filter === 'all' || p.category === filter
      return matchesSearch && matchesFilter
    })
  }, [projects, search, filter])

  const featured = filtered.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  if (!projects.length) {
    return (
      <SectionWrapper id="projects" title="Projects">
        <p className="text-center text-slate-500">Projects will appear here once added.</p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="A collection of things I've built — from web apps to AI experiments"
      accentColor="pink"
    >
      {/* Search + filter */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="futuristic-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                filter === cat
                  ? 'bg-pink-DEFAULT/20 text-pink-DEFAULT border border-pink-DEFAULT/30'
                  : 'text-slate-400 border border-slate-700 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured projects */}
      {featured.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((project, i) => (
              <ProjectCard key={project._id} project={project} featured onClick={() => setSelected(project)} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Regular projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((project, i) => (
          <ProjectCard key={project._id} project={project} onClick={() => setSelected(project)} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-12">No projects match your search.</p>
      )}

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
  featured = false,
  onClick,
  index,
}: {
  project: Project
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
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
    >
      {/* Cover image */}
      <div className={`relative overflow-hidden bg-bg-tertiary ${featured ? 'h-52' : 'h-40'}`}>
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl opacity-30">
              {project.technologies[0] === 'React' ? '⚛️' :
               project.technologies[0] === 'Python' ? '🐍' : '🚀'}
            </div>
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-mono ${
          project.status === 'completed' ? 'bg-emerald-400/20 text-emerald-400' :
          project.status === 'in_progress' ? 'bg-amber-400/20 text-amber-400' :
          'bg-slate-400/20 text-slate-400'
        }`}>
          {project.status.replace('_', ' ')}
        </div>
        {featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs bg-pink-DEFAULT/20 text-pink-DEFAULT border border-pink-DEFAULT/30">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-100 group-hover:text-cyan-DEFAULT transition-colors mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map(tech => (
            <span key={tech} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 font-mono">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs text-slate-500">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3" onClick={e => e.stopPropagation()}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-DEFAULT transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-pink-DEFAULT transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
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
        className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImage} alt={project.title} className="w-full h-56 object-cover rounded-t-2xl" />
        ) : null}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100">{project.title}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-200 text-2xl leading-none ml-4">×</button>
          </div>

          <p className="text-slate-300 mb-6">{project.longDescription || project.description}</p>

          {project.features?.length ? (
            <div className="mb-4">
              <h4 className="text-sm font-mono text-cyan-DEFAULT mb-2 uppercase">Features</h4>
              <ul className="space-y-1">
                {project.features.map((f, i) => (
                  <li key={i} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-cyan-DEFAULT">▸</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.challenges?.length ? (
            <div className="mb-4">
              <h4 className="text-sm font-mono text-pink-DEFAULT mb-2 uppercase">Challenges</h4>
              <ul className="space-y-1">
                {project.challenges.map((c, i) => (
                  <li key={i} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-pink-DEFAULT">▸</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map(t => (
              <span key={t} className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300 font-mono">{t}</span>
            ))}
          </div>

          <div className="flex gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-neon-cyan px-4 py-2 rounded-lg text-sm">
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-neon-pink px-4 py-2 rounded-lg text-sm">
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}