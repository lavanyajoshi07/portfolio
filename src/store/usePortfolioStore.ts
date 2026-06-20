import { useState, useEffect } from 'react'
import { Project, Technology } from '@/types'

interface PortfolioState {
  projects: Project[]
  technologies: Technology[]
  activeCategory: string
}

let state: PortfolioState = {
  projects: [],
  technologies: [],
  activeCategory: 'all',
}

const listeners = new Set<(state: PortfolioState) => void>()

export const usePortfolioStore = () => {
  const [value, setValue] = useState(state)

  useEffect(() => {
    listeners.add(setValue)
    return () => {
      listeners.delete(setValue)
    }
  }, [])

  const setProjects = (projects: Project[]) => {
    state = { ...state, projects }
    listeners.forEach(l => l(state))
  }

  const setTechnologies = (technologies: Technology[]) => {
    state = { ...state, technologies }
    listeners.forEach(l => l(state))
  }

  const setActiveCategory = (activeCategory: string) => {
    state = { ...state, activeCategory }
    listeners.forEach(l => l(state))
  }

  return {
    ...value,
    setProjects,
    setTechnologies,
    setActiveCategory,
  }
}

export default usePortfolioStore
