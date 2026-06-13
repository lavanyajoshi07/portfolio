import { useState, useEffect } from 'react'

interface AppState {
  theme: 'dark' | 'light'
  audioPlaying: boolean
  chatbotOpen: boolean
  sidebarCollapsed: boolean
}

let state: AppState = {
  theme: 'dark',
  audioPlaying: false,
  chatbotOpen: false,
  sidebarCollapsed: false,
}

const listeners = new Set<(state: AppState) => void>()

export const useAppStore = () => {
  const [value, setValue] = useState(state)

  useEffect(() => {
    listeners.add(setValue)
    return () => {
      listeners.delete(setValue)
    }
  }, [])

  const setAudioPlaying = (audioPlaying: boolean) => {
    state = { ...state, audioPlaying }
    listeners.forEach(l => l(state))
  }

  const setChatbotOpen = (chatbotOpen: boolean) => {
    state = { ...state, chatbotOpen }
    listeners.forEach(l => l(state))
  }

  const setSidebarCollapsed = (sidebarCollapsed: boolean) => {
    state = { ...state, sidebarCollapsed }
    listeners.forEach(l => l(state))
  }

  return {
    ...value,
    setAudioPlaying,
    setChatbotOpen,
    setSidebarCollapsed,
  }
}

export default useAppStore
