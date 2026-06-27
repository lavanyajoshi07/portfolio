import mongoose, { Schema, model, models } from 'mongoose'

// ============================================================
// PROFILE
// ============================================================

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
    phone: String,
    leetcode: String,
    devto: String,
    medium: String,
  },
  isAvailableForWork: { type: Boolean, default: true },
  yearsOfExperience: Number,
  highlights: [String],
  currentFocus: [String],
}, { timestamps: true })

// ============================================================
// TECH STACK SETTINGS
// ============================================================
const TechStackSettingsSchema = new Schema({
  badgeText: { type: String, default: 'Tech Stack' },
  title: { type: String, required: true, default: 'Tech Stack' },
  subtitle: String,
  quote: String,
  categoriesEnabled: { type: Boolean, default: true },
  statsEnabled: { type: Boolean, default: true },
  quoteEnabled: { type: Boolean, default: true },
  animationsEnabled: { type: Boolean, default: true },
}, { timestamps: true })

// ============================================================
// TECHNOLOGY CATEGORY
// ============================================================
const TechnologyCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })

// ============================================================
// TECHNOLOGY
// ============================================================
const TechnologySchema = new Schema({
  name: { type: String, required: true },
  iconType: { type: String, enum: ['library', 'upload'], default: 'library' },
  icon: { type: String, required: true }, // Store icon string name or upload path
  categoryId: { type: Schema.Types.ObjectId, ref: 'TechnologyCategory', required: true },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  experience: String,
  description: String,
  color: String,
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })

// ============================================================
// TECH STATS
// ============================================================
const TechStatsSchema = new Schema({
  iconType: { type: String, enum: ['library', 'upload'], default: 'library' },
  icon: String,
  value: { type: String, required: true },
  label: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })

// ============================================================
// PROJECT
// ============================================================
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  fullDescription: String,
  thumbnail: {
    image: String,
    alt: String
  },
  gallery: [
    {
      image: String,
      alt: String
    }
  ],
  architectureDiagram: String,
  category: String,
  status: { type: String, enum: ['completed', 'in_progress', 'archived'], default: 'completed' },
  publishStatus: { type: String, enum: ['draft', 'preview', 'published'], default: 'draft' },
  featured: { type: Boolean, default: false },
  featuredOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  showOnHomepage: { type: Boolean, default: true },
  isCaseStudy: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  duration: String,
  teamSize: String,
  techStack: [String],
  tags: [String],
  searchKeywords: [String],
  keyMetrics: [
    {
      value: { type: String, required: true },
      label: { type: String, required: true }
    }
  ],
  highlights: [String],
  problemStatement: String,
  solution: String,
  challenges: String,
  outcomes: String,
  githubUrl: String,
  demoUrl: String,
  documentationUrl: String,
  videoDemoUrl: String,
  showGithub: { type: Boolean, default: true },
  showDemo: { type: Boolean, default: true },
  showDocumentation: { type: Boolean, default: true },
  showVideoDemo: { type: Boolean, default: true },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  viewCount: { type: Number, default: 0 },
}, { timestamps: true })

const CertificationSchema = new Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  logoMode: {
    type: String,
    enum: ['auto', 'custom'],
    default: 'auto'
  },
  logo: String,
  logoAlt: String,
  thumbnail: String,
  tags: [String],
  certificateUrl: String,
  credentialUrl: String,
  credentialLink: String,
  showCredential: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true })

// ============================================================
// ACHIEVEMENT CATEGORY
// ============================================================
const AchievementCategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  color: String,
  description: String,
  coverImage: String,
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true })

// ============================================================
// ACHIEVEMENT SETTINGS
// ============================================================
const AchievementSettingsSchema = new Schema({
  title: { type: String, default: 'ACHIEVEMENTS & AWARDS' },
  subtitle: { type: String, default: 'Recognitions, competitions, memberships, and engineering milestones.' },
  showCategoryGrid: { type: Boolean, default: true },
  animationsEnabled: { type: Boolean, default: true },
}, { timestamps: true })

// ============================================================
// ACHIEVEMENT
// ============================================================
const AchievementSchema = new Schema({
  title: { type: String, required: true },
  organization: String,
  description: String,
  date: String,
  year: String,
  category: { type: Schema.Types.ObjectId, ref: 'AchievementCategory', required: true },
  icon: String,
  badgeColor: String,
  showInCategory: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  achievementImage: String,
  achievementUrl: String,
  showAchievementUrl: { type: Boolean, default: true },
  tags: [String],
  metricValue: String,
  metricLabel: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true })

// ============================================================
// CONTACT MESSAGE
// ============================================================
const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  replyText: { type: String },
  repliedAt: { type: Date },
  source: {
    type: String,
    enum: ['contact_form', 'chat'],
    default: 'contact_form',
  },
}, { timestamps: true })

// ============================================================
// ANALYTICS
// ============================================================
const AnalyticsEventSchema = new Schema({
  type: {
    type: String,
    enum: ['page_view', 'resume_download', 'audio_play', 'project_view', 'cta_click', 'contact_submit', 'recruiter_toggle'],
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
  splashEnabled: { type: Boolean, default: true },
  videoAvatarEnabled: { type: Boolean, default: true },
  animatedBgEnabled: { type: Boolean, default: true },
  audioPlayerEnabled: { type: Boolean, default: true },
  contactEmail: String,
  copyrightText: String,
  accentColor: { type: String, default: '#00E5FF' },
  secondaryColor: { type: String, default: '#FF4FD8' },
  recruiterModeEnabled: { type: Boolean, default: false },
  sectionSettings: [{
    sectionId: { type: String, required: true },
    visible: { type: Boolean, default: true },
    recruiterVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  }],
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
  thumbnailUrl: String,
  mediumUrl: String,
  originalUrl: String,
}, { timestamps: true })

// ============================================================
// RESUME
// ============================================================
const ResumeSkillSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
})

const ResumeProjectSchema = new Schema({
  title: { type: String, required: true },
  technologies: String,
  bullets: [String],
})

const ResumeExperienceSchema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: String,
  bullets: [String],
})

const ResumeEducationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: String,
  coursework: String,
  description: String,
  bullets: [String],
})

const ResumeSoftSkillSchema = new Schema({
  title: { type: String, required: true },
  description: String,
})

const ResumeSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  github: String,
  linkedin: String,
  address: String,
  summary: String,
  skills: [ResumeSkillSchema],
  projects: [ResumeProjectSchema],
  experience: [ResumeExperienceSchema],
  education: [ResumeEducationSchema],
  certifications: [String],
  achievements: [String],
  softSkills: [ResumeSoftSkillSchema],
}, { timestamps: true })

// ============================================================
// NEW MODELS FOR MASTER REDESIGN
// ============================================================

const ActivityLogSchema = new Schema({
  text: { type: String, required: true },
  date: { type: String, required: true },
  icon: String,
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
}, { timestamps: true })

const FutureGoalSchema = new Schema({
  text: { type: String, required: true },
  category: String,
  completed: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
}, { timestamps: true })


const FaqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
}, { timestamps: true })

const CommunityItemSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['hackathon', 'open_source', 'workshop', 'event', 'other'], required: true },
  date: String,
  link: String,
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const SeoSettingsSchema = new Schema({
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  keywords: [String],
  ogImage: String,
  twitterImage: String,
  canonicalUrl: String,
}, { timestamps: true })

const CodingActivitySettingsSchema = new Schema({
  // General Settings
  title: { type: String, default: 'Coding Activity' },
  subtitle: { type: String, default: 'Real-time stats from GitHub, LeetCode, and other platforms' },

  // Overview Cards
  problemsSolved: { type: String, default: '—' },
  problemsSolvedSource: { type: String, default: 'LeetCode • Codeforces' },
  contributions: { type: String, default: '—' },
  contributionsSource: { type: String, default: 'Total Contributions' },
  publicRepos: { type: String, default: '—' },
  publicReposSource: { type: String, default: 'GitHub' },
  followers: { type: String, default: '—' },
  followersSource: { type: String, default: 'GitHub' },

  // Contribution Graph
  contributionGraphImage: { type: String, default: '' },
  contributionGraphAlt: { type: String, default: 'GitHub Contribution Graph' },
  graphImageDisplayMode: { type: String, enum: ['cover', 'contain', 'fill'], default: 'cover' },

  // Mini Stats
  totalContributions: { type: String, default: '—' },
  currentStreak: { type: String, default: '—' },
  longestStreak: { type: String, default: '—' },
  activeDays: { type: String, default: '—' },

  // GitHub Profile
  profileImage: { type: String, default: '' },
  profileName: { type: String, default: 'Your Name' },
  profileUsername: { type: String, default: 'username' },
  profileBio: { type: String, default: '' },
  githubFollowers: { type: String, default: '—' },
  githubFollowing: { type: String, default: '—' },
  githubRepos: { type: String, default: '—' },
  githubContributions: { type: String, default: '—' },
  githubCurrentStreak: { type: String, default: '—' },
  githubProfileUrl: { type: String, default: 'https://github.com' },

  // Motivational Banner
  motivationalQuote: { type: String, default: 'Consistency compounds faster than talent.' },
  motivationalIcon: { type: String, default: 'Activity' },
  motivationalEmoji: { type: String, default: '⚡' },

  // Visibility Toggles
  showOverviewCards: { type: Boolean, default: true },
  showContributionGraph: { type: Boolean, default: true },
  showGithubProfile: { type: Boolean, default: true },
  showMotivationalBanner: { type: Boolean, default: true },
}, { timestamps: true })

// ============================================================
// EXPORT MODELS (with hot reload safety)
// ============================================================
if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).Profile;
  delete (mongoose.models as any).TechStackSettings;
  delete (mongoose.models as any).TechnologyCategory;
  delete (mongoose.models as any).Technology;
  delete (mongoose.models as any).TechStats;
  delete (mongoose.models as any).Project;
  delete (mongoose.models as any).Certification;
  delete (mongoose.models as any).Achievement;
  delete (mongoose.models as any).AchievementCategory;
  delete (mongoose.models as any).AchievementSettings;
  delete (mongoose.models as any).ContactMessage;
  delete (mongoose.models as any).AnalyticsEvent;
  delete (mongoose.models as any).SiteSettings;
  delete (mongoose.models as any).AdminUser;
  delete (mongoose.models as any).MediaAsset;
  delete (mongoose.models as any).Resume;
  delete (mongoose.models as any).ActivityLog;
  delete (mongoose.models as any).FutureGoal;
  delete (mongoose.models as any).Faq;
  delete (mongoose.models as any).CommunityItem;
  delete (mongoose.models as any).SeoSettings;
  delete (mongoose.models as any).CodingActivitySettings;
}

export const Profile = models.Profile || model('Profile', ProfileSchema)
export const TechStackSettings = models.TechStackSettings || model('TechStackSettings', TechStackSettingsSchema)
export const TechnologyCategory = models.TechnologyCategory || model('TechnologyCategory', TechnologyCategorySchema)
export const Technology = models.Technology || model('Technology', TechnologySchema)
export const TechStats = models.TechStats || model('TechStats', TechStatsSchema)
export const Project = models.Project || model('Project', ProjectSchema)
export const Certification = models.Certification || model('Certification', CertificationSchema)
export const Achievement = models.Achievement || model('Achievement', AchievementSchema)
export const AchievementCategory = models.AchievementCategory || model('AchievementCategory', AchievementCategorySchema)
export const AchievementSettings = models.AchievementSettings || model('AchievementSettings', AchievementSettingsSchema)
export const ContactMessage = models.ContactMessage || model('ContactMessage', ContactMessageSchema)
export const AnalyticsEvent = models.AnalyticsEvent || model('AnalyticsEvent', AnalyticsEventSchema)
export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema)
export const AdminUser = models.AdminUser || model('AdminUser', AdminUserSchema)
export const MediaAsset = models.MediaAsset || model('MediaAsset', MediaAssetSchema)
export const Resume = models.Resume || model('Resume', ResumeSchema)

export const ActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema)
export const FutureGoal = models.FutureGoal || model('FutureGoal', FutureGoalSchema)
export const Faq = models.Faq || model('Faq', FaqSchema)
export const CommunityItem = models.CommunityItem || model('CommunityItem', CommunityItemSchema)
export const SeoSettings = models.SeoSettings || model('SeoSettings', SeoSettingsSchema)
export const CodingActivitySettings = models.CodingActivitySettings || model('CodingActivitySettings', CodingActivitySettingsSchema)