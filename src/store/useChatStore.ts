import { useState, useEffect } from 'react'
import { ChatMessage } from '@/types'

interface ChatState {
  messages: ChatMessage[]
  sessionId: string | null
  isLoading: boolean
}

let state: ChatState = {
  messages: [],
  sessionId: null,
  isLoading: false,
}

const listeners = new Set<(state: ChatState) => void>()

export const useChatStore = () => {
  const [value, setValue] = useState(state)

  useEffect(() => {
    listeners.add(setValue)
    return () => {
      listeners.delete(setValue)
    }
  }, [])

  const setMessages = (messages: ChatMessage[]) => {
    state = { ...state, messages }
    listeners.forEach(l => l(state))
  }

  const addMessage = (message: ChatMessage) => {
    state = { ...state, messages: [...state.messages, message] }
    listeners.forEach(l => l(state))
  }

  const setSessionId = (sessionId: string) => {
    state = { ...state, sessionId }
    listeners.forEach(l => l(state))
  }

  const setIsLoading = (isLoading: boolean) => {
    state = { ...state, isLoading }
    listeners.forEach(l => l(state))
  }

  return {
    ...value,
    setMessages,
    addMessage,
    setSessionId,
    setIsLoading,
  }
}

export default useChatStore
