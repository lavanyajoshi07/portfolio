// ============================================================
// CORE DOMAIN TYPES
// ============================================================

export interface Profile {
  _id?: string
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  location: string
  profileImage?: string
  heroVideo?: string
  introAudio?: string
  transcript?: TranscriptEntry[]
  resumeUrl?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    website?: string
  }
  education: Education[]
  careerGoals?: string
  learningJourney?: string
  isAvailableForWork: boolean
  yearsOfExperience?: number
  updatedAt?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
  current: boolean
  gpa?: string
  description?: string
}

export interface TranscriptEntry {
  startTime: number // seconds
  endTime: number
  text: string
}

// ============================================================
// SKILLS
// ============================================================

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'ai_ml'
  | 'tools'
  | 'languages'
  | 'mobile'
  | 'other'

export interface Skill {
  _id?: string
  name: string
  category: SkillCategory
  level: number // 0-100
  yearsOfExperience?: number
  icon?: string
  color?: string
  featured: boolean
  order: number
}

// ============================================================
// PROJECTS
// ============================================================

export interface Project {
  _id?: string
  slug: string
  title: string
  description: string
  longDescription?: string
  coverImage?: string
  gallery?: string[]
  technologies: string[]
  category: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  status: 'completed' | 'in_progress' | 'archived'
  startDate?: string
  endDate?: string
  challenges?: string[]
  lessons?: string[]
  features?: string[]
  viewCount: number
  order: number
  createdAt?: string
  updatedAt?: string
}

// ============================================================
// CERTIFICATIONS
// ============================================================

export interface Certification {
  _id?: string
  title: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  image?: string
  certificateImage?: string
  skills?: string[]
  featured: boolean
  order: number
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

export type AchievementType = 'hackathon' | 'competition' | 'leadership' | 'academic' | 'award' | 'other'

export interface Achievement {
  _id?: string
  title: string
  description: string
  type: AchievementType
  date: string
  position?: string
  organizer?: string
  image?: string
  url?: string
  featured: boolean
  order: number
}

// ============================================================
// TIMELINE
// ============================================================

export type TimelineType = 'education' | 'project' | 'achievement' | 'milestone' | 'work'

export interface TimelineItem {
  _id?: string
  title: string
  description: string
  type: TimelineType
  date: string
  icon?: string
  color?: string
  tags?: string[]
  url?: string
  featured: boolean
  order: number
}

// ============================================================
// CODING PROFILES
// ============================================================

export interface CodingProfile {
  _id?: string
  platform: 'github' | 'leetcode' | 'hackerrank' | 'codechef' | 'codeforces' | 'other'
  username: string
  profileUrl?: string
  apiToken?: string // stored encrypted, never sent to client
  displayData?: CodingStats
  enabled: boolean
  lastSynced?: string
}

export interface CodingStats {
  totalSolved?: number
  easySolved?: number
  mediumSolved?: number
  hardSolved?: number
  ranking?: number
  rating?: number
  stars?: number
  contributions?: number
  followers?: number
  publicRepos?: number
  streak?: number
  heatmapData?: HeatmapEntry[]
  languageStats?: LanguageStat[]
}

export interface HeatmapEntry {
  date: string
  count: number
}

export interface LanguageStat {
  language: string
  percentage: number
  color: string
}

// ============================================================
// MESSAGES
// ============================================================

export interface ContactMessage {
  _id?: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt?: string
  source: 'contact_form' | 'chat'
}


// ============================================================
// ANALYTICS
// ============================================================

export interface AnalyticsEvent {
  _id?: string
  type: 'page_view' | 'resume_download' | 'audio_play' | 'project_view' | 'cta_click' | 'contact_submit'
  path?: string
  projectId?: string
  sessionId: string
  ip?: string
  userAgent?: string
  referrer?: string
  createdAt?: string
}

export interface AnalyticsSummary {
  totalVisitors: number
  uniqueVisitors: number
  resumeDownloads: number
  audioPlays: number
  projectViews: number
  contactSubmissions: number
  period: 'today' | '7d' | '30d' | 'all'
}

// ============================================================
// SETTINGS
// ============================================================

export interface SiteSettings {
  _id?: string
  siteName: string
  siteDescription: string
  siteKeywords: string[]
  ogImage?: string
  googleAnalyticsId?: string
  maintenanceMode: boolean
  contactEmail: string
  copyrightText: string
  accentColor: string
  secondaryColor: string
  updatedAt?: string
}

// ============================================================
// ADMIN USER
// ============================================================

export interface AdminUser {
  _id?: string
  email: string
  password?: string // hashed, never sent to client
  name: string
  role: 'super_admin' | 'admin' | 'editor'
  avatar?: string
  lastLogin?: string
  createdAt?: string
}

// ============================================================
// MEDIA ASSETS
// ============================================================

export type MediaType = 'image' | 'video' | 'audio' | 'document'

export interface MediaAsset {
  _id?: string
  name: string
  type: MediaType
  url: string
  publicId: string // Cloudinary public ID
  size: number
  mimeType: string
  dimensions?: { width: number; height: number }
  duration?: number // for audio/video in seconds
  altText?: string
  usedIn?: string[]
  createdAt?: string
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================
// COMPONENT PROP TYPES
// ============================================================

export interface SectionProps {
  className?: string
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  currentTranscript?: string
}