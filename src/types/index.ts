// ============================================================
// CORE DOMAIN TYPES
// ============================================================

export interface Profile {
  _id?: string
  name: string
  title: string
  tagline: string
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
    phone?: string
    leetcode?: string
    devto?: string
    medium?: string
  }
  isAvailableForWork: boolean
  yearsOfExperience?: number
  updatedAt?: string
}

export interface TranscriptEntry {
  startTime: number // seconds
  endTime: number
  text: string
}

// ============================================================
// SKILLS
// ============================================================

export interface TechStackSettings {
  _id?: string
  badgeText: string
  title: string
  subtitle?: string
  quote?: string
  categoriesEnabled: boolean
  statsEnabled: boolean
  quoteEnabled: boolean
  animationsEnabled: boolean
}

export interface TechnologyCategory {
  _id?: string
  name: string
  slug: string
  order: number
  active: boolean
  deletedAt?: string | null
}

export interface Technology {
  _id?: string
  name: string
  iconType: 'library' | 'upload'
  icon: string
  categoryId: string
  proficiency: number
  experience?: string
  description?: string
  color?: string
  displayOrder: number
  active: boolean
  featured: boolean
  deletedAt?: string | null
}

export interface TechStats {
  _id?: string
  iconType: 'library' | 'upload'
  icon?: string
  value: string
  label: string
  order: number
  active: boolean
  deletedAt?: string | null
}

// ============================================================
// PROJECTS
// ============================================================

export interface Project {
  _id?: string
  title: string
  slug: string
  shortDescription: string
  fullDescription?: string
  thumbnail?: {
    image: string
    alt: string
  }
  gallery?: {
    image: string
    alt: string
  }[]
  architectureDiagram?: string
  category?: string
  status: 'completed' | 'in_progress' | 'archived'
  publishStatus?: 'draft' | 'preview' | 'published'
  featured: boolean
  featuredOrder?: number
  isPublished: boolean
  showOnHomepage: boolean
  isCaseStudy: boolean
  sortOrder?: number
  duration?: string
  teamSize?: string
  techStack: string[]
  tags?: string[]
  searchKeywords?: string[]
  keyMetrics?: {
    value: string
    label: string
  }[]
  highlights?: string[]
  problemStatement?: string
  solution?: string
  challenges?: string
  outcomes?: string
  githubUrl?: string
  demoUrl?: string
  documentationUrl?: string
  videoDemoUrl?: string
  showGithub?: boolean
  showDemo?: boolean
  showDocumentation?: boolean
  showVideoDemo?: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  viewCount: number
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
  logoMode: 'auto' | 'custom'
  logo?: string
  logoAlt?: string
  thumbnail?: string
  tags?: string[]
  certificateUrl?: string
  credentialUrl?: string
  featured: boolean
  sortOrder: number
  isPublished: boolean
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

export interface AchievementCategory {
  _id?: string
  name: string
  slug: string
  icon?: string
  color?: string
  description?: string
  coverImage?: string
  displayOrder: number
  active: boolean
  deletedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Achievement {
  _id?: string
  title: string
  organization?: string
  description?: string
  date: string
  year: string
  category: string | AchievementCategory
  icon?: string
  badgeColor?: string
  showInCategory: boolean
  displayOrder: number
  achievementImage?: string
  achievementUrl?: string
  tags?: string[]
  metricValue?: string
  metricLabel?: string
  deletedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface AchievementSettings {
  _id?: string
  title: string
  subtitle?: string
  showCategoryGrid: boolean
  animationsEnabled: boolean
  createdAt?: string
  updatedAt?: string
}

// ============================================================
// CODING ACTIVITY
// ============================================================

export interface CodingActivitySettings {
  _id?: string
  title: string
  subtitle: string

  problemsSolved: string
  problemsSolvedSource: string
  contributions: string
  contributionsSource: string
  publicRepos: string
  publicReposSource: string
  followers: string
  followersSource: string

  contributionGraphImage: string
  contributionGraphAlt: string
  graphImageDisplayMode?: 'cover' | 'contain' | 'fill'

  totalContributions: string
  currentStreak: string
  longestStreak: string
  activeDays: string

  profileImage: string
  profileName: string
  profileUsername: string
  profileBio: string

  githubFollowers: string
  githubFollowing: string
  githubRepos: string
  githubContributions: string
  githubCurrentStreak: string
  githubProfileUrl: string

  motivationalQuote: string
  motivationalIcon: string
  motivationalEmoji: string

  showOverviewCards: boolean
  showContributionGraph: boolean
  showGithubProfile: boolean
  showMotivationalBanner: boolean
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

export interface SectionSetting {
  sectionId: string
  visible: boolean
  recruiterVisible: boolean
  order: number
}

export interface SiteSettings {
  _id?: string
  siteName: string
  siteDescription: string
  siteKeywords: string[]
  ogImage?: string
  googleAnalyticsId?: string
  maintenanceMode: boolean
  splashEnabled?: boolean
  videoAvatarEnabled?: boolean
  animatedBgEnabled?: boolean
  audioPlayerEnabled?: boolean
  contactEmail: string
  copyrightText: string
  accentColor: string
  secondaryColor: string
  recruiterModeEnabled?: boolean
  sectionSettings?: SectionSetting[]
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

// ============================================================
// NEW INTERFACES FOR MASTER REDESIGN
// ============================================================


export interface ActivityLog {
  _id?: string
  text: string
  date: string
  icon?: string
  order: number
  enabled: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FutureGoal {
  _id?: string
  text: string
  category?: string
  completed: boolean
  order: number
  enabled: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Faq {
  _id?: string
  question: string
  answer: string
  order: number
  enabled: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CommunityItem {
  _id?: string
  title: string
  description?: string
  category: 'hackathon' | 'open_source' | 'workshop' | 'event' | 'other'
  date?: string
  link?: string
  enabled: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}