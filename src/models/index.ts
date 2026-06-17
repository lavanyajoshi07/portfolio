import mongoose, { Schema, model, models } from 'mongoose'

// ============================================================
// PROFILE
// ============================================================
const EducationSchema = new Schema({
  institution: String,
  degree: String,
  field: String,
  startYear: Number,
  endYear: Number,
  current: { type: Boolean, default: false },
  gpa: String,
  description: String,
})

const TranscriptEntrySchema = new Schema({
  startTime: Number,
  endTime: Number,
  text: String,
})

const ProfileSchema = new Schema({
  name: { type: String, required: true, default: 'Your Name' },
  title: { type: String, default: 'Software Engineer & AI Enthusiast' },
  tagline: { type: String, default: 'Building the future, one line of code at a time.' },
  bio: { type: String, default: '' },
  email: { type: String, default: '' },
  location: { type: String, default: '' },
  profileImage: String,
  heroVideo: String,
  introAudio: String,
  transcript: [TranscriptEntrySchema],
  resumeUrl: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    website: String,
  },
  education: [EducationSchema],
  careerGoals: String,
  learningJourney: String,
  isAvailableForWork: { type: Boolean, default: true },
  yearsOfExperience: Number,
}, { timestamps: true })

// ============================================================
// SKILL
// ============================================================
const SkillSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'ai_ml', 'tools', 'languages', 'mobile', 'other'],
    required: true,
  },
  level: { type: Number, min: 0, max: 100, required: true },
  yearsOfExperience: Number,
  icon: String,
  color: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ============================================================
// PROJECT
// ============================================================
const ProjectSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: String,
  coverImage: String,
  gallery: [String],
  technologies: [String],
  category: String,
  tags: [String],
  githubUrl: String,
  liveUrl: String,
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'archived'],
    default: 'completed',
  },
  startDate: String,
  endDate: String,
  challenges: [String],
  lessons: [String],
  features: [String],
  viewCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ============================================================
// CERTIFICATION
// ============================================================
const CertificationSchema = new Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: String,
  expiryDate: String,
  credentialId: String,
  credentialUrl: String,
  image: String,
  certificateImage: String,
  skills: [String],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ============================================================
// ACHIEVEMENT
// ============================================================
const AchievementSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['hackathon', 'competition', 'leadership', 'academic', 'award', 'other'],
    required: true,
  },
  date: String,
  position: String,
  organizer: String,
  image: String,
  url: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ============================================================
// TIMELINE
// ============================================================
const TimelineSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['education', 'project', 'achievement', 'milestone', 'work'],
    required: true,
  },
  date: String,
  icon: String,
  color: String,
  tags: [String],
  url: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ============================================================
// CODING PROFILE
// ============================================================
const HeatmapEntrySchema = new Schema({
  date: String,
  count: Number,
})

const LanguageStatSchema = new Schema({
  language: String,
  percentage: Number,
  color: String,
})

const CodingStatsSchema = new Schema({
  totalSolved: Number,
  easySolved: Number,
  mediumSolved: Number,
  hardSolved: Number,
  ranking: Number,
  rating: Number,
  stars: Number,
  contributions: Number,
  followers: Number,
  publicRepos: Number,
  streak: Number,
  heatmapData: [HeatmapEntrySchema],
  languageStats: [LanguageStatSchema],
})

const CodingProfileSchema = new Schema({
  platform: {
    type: String,
    enum: ['github', 'leetcode', 'hackerrank', 'codechef', 'codeforces', 'other'],
    required: true,
  },
  username: { type: String, required: true },
  profileUrl: String,
  displayData: CodingStatsSchema,
  enabled: { type: Boolean, default: true },
  lastSynced: Date,
}, { timestamps: true })

// ============================================================
// CONTACT MESSAGE
// ============================================================
const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  source: {
    type: String,
    enum: ['contact_form', 'chat'],
    default: 'contact_form',
  },
}, { timestamps: true })

// ============================================================
// CHAT CONVERSATION
// ============================================================
const ChatMessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const ChatConversationSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: [ChatMessageSchema],
  visitorName: String,
  visitorEmail: String,
}, { timestamps: true })

// ============================================================
// ANALYTICS
// ============================================================
const AnalyticsEventSchema = new Schema({
  type: {
    type: String,
    enum: ['page_view', 'resume_download', 'audio_play', 'project_view', 'cta_click', 'contact_submit'],
    required: true,
  },
  path: String,
  projectId: String,
  sessionId: String,
  ip: String,
  userAgent: String,
  referrer: String,
}, { timestamps: true })

AnalyticsEventSchema.index({ createdAt: -1 })
AnalyticsEventSchema.index({ type: 1, createdAt: -1 })

// ============================================================
// SITE SETTINGS
// ============================================================
const SiteSettingsSchema = new Schema({
  siteName: { type: String, default: 'Portfolio' },
  siteDescription: String,
  siteKeywords: [String],
  ogImage: String,
  googleAnalyticsId: String,
  maintenanceMode: { type: Boolean, default: false },
  allowChatbot: { type: Boolean, default: true },
  splashEnabled: { type: Boolean, default: true },
  videoAvatarEnabled: { type: Boolean, default: true },
  animatedBgEnabled: { type: Boolean, default: true },
  audioPlayerEnabled: { type: Boolean, default: true },
  contactEmail: String,
  copyrightText: String,
  accentColor: { type: String, default: '#00E5FF' },
  secondaryColor: { type: String, default: '#FF4FD8' },
}, { timestamps: true })

// ============================================================
// ADMIN USER
// ============================================================
const AdminUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'editor'],
    default: 'admin',
  },
  avatar: String,
  lastLogin: Date,
}, { timestamps: true })

// ============================================================
// MEDIA ASSET
// ============================================================
const MediaAssetSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document'],
    required: true,
  },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  size: Number,
  mimeType: String,
  dimensions: { width: Number, height: Number },
  duration: Number,
  altText: String,
  usedIn: [String],
}, { timestamps: true })

// ============================================================
// EXPORT MODELS (with hot reload safety)
// ============================================================
if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).Project;
  delete (mongoose.models as any).Certification;
}

export const Profile = models.Profile || model('Profile', ProfileSchema)
export const Skill = models.Skill || model('Skill', SkillSchema)
export const Project = models.Project || model('Project', ProjectSchema)
export const Certification = models.Certification || model('Certification', CertificationSchema)
export const Achievement = models.Achievement || model('Achievement', AchievementSchema)
export const Timeline = models.Timeline || model('Timeline', TimelineSchema)
export const CodingProfile = models.CodingProfile || model('CodingProfile', CodingProfileSchema)
export const ContactMessage = models.ContactMessage || model('ContactMessage', ContactMessageSchema)
export const ChatConversation = models.ChatConversation || model('ChatConversation', ChatConversationSchema)
export const AnalyticsEvent = models.AnalyticsEvent || model('AnalyticsEvent', AnalyticsEventSchema)
export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema)
export const AdminUser = models.AdminUser || model('AdminUser', AdminUserSchema)
export const MediaAsset = models.MediaAsset || model('MediaAsset', MediaAssetSchema)