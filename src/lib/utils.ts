import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date.toString()

  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

/**
 * Truncate string to length
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Check if string is valid email
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Calculate reading time for text
 */
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Group array by key
 */
export const groupBy = <T, K extends string | number | symbol>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return arr.reduce(
    (result, item) => {
      const k = key(item)
      if (!result[k]) result[k] = []
      result[k].push(item)
      return result
    },
    {} as Record<K, T[]>
  )
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Get query parameters from URL
 */
export const getQueryParams = (url: string): Record<string, string> => {
  const params = new URLSearchParams(new URL(url).search)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/**
 * Sleep function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Parse and optimize Cloudinary video URLs or return default urls
 */
export function getOptimizedVideoUrls(url: string | undefined): {
  webm: string
  mp4: string
  webmMobile: string
  mp4Mobile: string
  isCloudinary: boolean
} {
  if (!url) {
    return {
      webm: '',
      mp4: '/videos/avatar.mp4',
      webmMobile: '',
      mp4Mobile: '/videos/avatar-mobile.mp4',
      isCloudinary: false,
    }
  }

  const isCloudinary = url.includes('res.cloudinary.com')
  if (isCloudinary) {
    const parts = url.split('/video/upload/')
    if (parts.length === 2) {
      const prefix = parts[0] + '/video/upload'
      const rest = parts[1]

      // Extract path without file extension
      const lastDotIndex = rest.lastIndexOf('.')
      const pathWithoutExtension = lastDotIndex !== -1 ? rest.substring(0, lastDotIndex) : rest

      // Cloudinary video transformations:
      // q_auto:eco -> economy quality (highly recommended for background/ambient video)
      // w_1280,c_limit -> limit width to 1280px to prevent excessive bandwidth usage
      // e_brightness:10,e_contrast:5,e_saturation:10 -> offloads CSS filters to server side pre-processing
      const transformationsWebm = 'f_webm,q_auto:eco,w_1280,c_limit,e_brightness:10,e_contrast:5,e_saturation:10'
      const transformationsMp4 = 'f_mp4,q_auto:eco,w_1280,c_limit,e_brightness:10,e_contrast:5,e_saturation:10'

      // Mobile video: 720p maximum, no real-time filters (brightness, contrast, saturation) to preserve GPU fillrate
      const transformationsWebmMobile = 'f_webm,q_auto:eco,w_720,c_limit'
      const transformationsMp4Mobile = 'f_mp4,q_auto:eco,w_720,c_limit'

      return {
        webm: `${prefix}/${transformationsWebm}/${pathWithoutExtension}.webm`,
        mp4: `${prefix}/${transformationsMp4}/${pathWithoutExtension}.mp4`,
        webmMobile: `${prefix}/${transformationsWebmMobile}/${pathWithoutExtension}.webm`,
        mp4Mobile: `${prefix}/${transformationsMp4Mobile}/${pathWithoutExtension}.mp4`,
        isCloudinary: true,
      }
    }
  }

  // Fallback for non-Cloudinary direct URLs (e.g. local public files or other hosts)
  return {
    webm: '',
    mp4: url,
    webmMobile: '',
    mp4Mobile: url,
    isCloudinary: false,
  }
}