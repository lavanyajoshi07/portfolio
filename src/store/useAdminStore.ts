import { useState, useEffect } from 'react'

interface AdminState {
  currentTab: string
  isSaving: boolean
  editId: string | null
}

let state: AdminState = {
  currentTab: 'dashboard',
  isSaving: false,
  editId: null,
}

const listeners = new Set<(state: AdminState) => void>()

export const useAdminStore = () => {
  const [value, setValue] = useState(state)

  useEffect(() => {
    listeners.add(setValue)
    return () => {
      listeners.delete(setValue)
    }
  }, [])

  const setCurrentTab = (currentTab: string) => {
    state = { ...state, currentTab }
    listeners.forEach(l => l(state))
  }

  const setIsSaving = (isSaving: boolean) => {
    state = { ...state, isSaving }
    listeners.forEach(l => l(state))
  }

  const setEditId = (editId: string | null) => {
    state = { ...state, editId }
    listeners.forEach(l => l(state))
  }

  return {
    ...value,
    setCurrentTab,
    setIsSaving,
    setEditId,
  }
}

export default useAdminStore
