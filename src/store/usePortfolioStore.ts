import { useState, useEffect } from 'react'
import { Project, Skill } from '@/types'

interface PortfolioState {
  projects: Project[]
  skills: Skill[]
  activeCategory: string
}

let state: PortfolioState = {
  projects: [],
  skills: [],
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

  const setSkills = (skills: Skill[]) => {
    state = { ...state, skills }
    listeners.forEach(l => l(state))
  }

  const setActiveCategory = (activeCategory: string) => {
    state = { ...state, activeCategory }
    listeners.forEach(l => l(state))
  }

  return {
    ...value,
    setProjects,
    setSkills,
    setActiveCategory,
  }
}

export default usePortfolioStore
