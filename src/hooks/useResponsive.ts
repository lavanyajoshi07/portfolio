'use client'

import { useState, useEffect } from 'react'

export function useResponsive() {
  const [state, setState] = useState({
    isPortraitMobile: false,
    isLandscapeMobile: false,
    isTablet: false,
    isDesktop: false,
    isMobile: false,
    mounted: false,
  })

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      const isPortraitMobile = w < 768
      const isLandscapeMobile = w < 1024 && h < 500
      const isTablet = w >= 768 && w < 1024 && h >= 500
      const isDesktop = w >= 1024
      const isMobile = isPortraitMobile || isLandscapeMobile

      setState({
        isPortraitMobile,
        isLandscapeMobile,
        isTablet,
        isDesktop,
        isMobile,
        mounted: true,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return state
}
