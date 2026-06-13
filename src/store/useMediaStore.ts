import { useState, useEffect } from 'react'
import { MediaAsset } from '@/types'

interface MediaState {
  assets: MediaAsset[]
  selectedAsset: MediaAsset | null
}

let state: MediaState = {
  assets: [],
  selectedAsset: null,
}

const listeners = new Set<(state: MediaState) => void>()

export const useMediaStore = () => {
  const [value, setValue] = useState(state)

  useEffect(() => {
    listeners.add(setValue)
    return () => {
      listeners.delete(setValue)
    }
  }, [])

  const setAssets = (assets: MediaAsset[]) => {
    state = { ...state, assets }
    listeners.forEach(l => l(state))
  }

  const setSelectedAsset = (selectedAsset: MediaAsset | null) => {
    state = { ...state, selectedAsset }
    listeners.forEach(l => l(state))
  }

  return {
    ...value,
    setAssets,
    setSelectedAsset,
  }
}

export default useMediaStore
