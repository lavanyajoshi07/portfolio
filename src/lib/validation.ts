import { z } from 'zod'

// A URL field that also accepts an empty string (so untouched optional inputs
// don't block submission). `.optional()` alone only allows `undefined`, NOT ''.
// A preprocessor helper for optional URLs to handle null, undefined, and empty string
const optionalUrl = z.preprocess(
  (val) => (val === '' || val === null || val === undefined) ? undefined : val,
  z.string().refine(
    (v) => {
      if (!v) return true
      if (v.startsWith('/')) return true
      try {
        new URL(v)
        return true
      } catch {
        return false
      }
    },
    { message: 'Must be a valid URL or relative path' }
  ).optional()
)

// A preprocessor helper for optional strings to handle null
const optionalString = z.preprocess(
  (val) => (val === null || val === undefined) ? undefined : val,
  z.string().optional()
)

// A preprocessor helper for optional numbers to handle null, undefined, empty strings, and NaN values
const optionalNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
      return undefined
    }
    return Number(val)
  },
  z.number().optional()
)

// Profile
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  location: optionalString,
  profileImage: optionalUrl,
  heroVideo: optionalUrl,
  resumeUrl: optionalUrl,
  yearsOfExperience: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val))) {
        return undefined
      }
      return Number(val)
    },
    z.number().min(0, 'Years of experience must be at least 0').optional()
  ),
  isAvailableForWork: z.boolean().default(true),
  // These were missing — Zod was silently stripping them from the payload,
  // so they could never be saved even when the request went through.
  socialLinks: z
    .object({
      github: optionalUrl,
      linkedin: optionalUrl,
      twitter: optionalUrl,
      website: optionalUrl,
      phone: z.preprocess((val) => (val === '' || val === null || val === undefined) ? undefined : val, z.string().optional()),
      leetcode: optionalUrl,
      devto: optionalUrl,
      medium: optionalUrl,
    })
    .optional(),
})

// Tech Stack Settings
export const techStackSettingsSchema = z.object({
  badgeText: z.string().min(1, 'Badge text is required').default('Tech Stack'),
  title: z.string().min(1, 'Title is required').default('Tech Stack'),
  subtitle: z.string().optional().default(''),
  quote: z.string().optional().default(''),
  categoriesEnabled: z.boolean().default(true),
  statsEnabled: z.boolean().default(true),
  quoteEnabled: z.boolean().default(true),
  animationsEnabled: z.boolean().default(true),
})

// Technology Category
export const technologyCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  order: z.number().default(0).optional(),
  active: z.boolean().default(true).optional(),
  deletedAt: z.preprocess(
    (val) => (val === '' || val === null || val === undefined) ? null : new Date(val as string),
    z.date().nullable().optional()
  ),
})

// Technology
export const technologySchema = z.object({
  name: z.string().min(1, 'Technology name is required'),
  iconType: z.enum(['library', 'upload']).default('library'),
  icon: z.string().min(1, 'Icon name is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  proficiency: z.number().min(0).max(100).default(80).optional(),
  experience: z.string().optional().default(''),
  description: z.string().optional().default(''),
  color: z.string().optional().default(''),
  displayOrder: z.number().default(0).optional(),
  active: z.boolean().default(true).optional(),
  featured: z.boolean().default(false).optional(),
  deletedAt: z.preprocess(
    (val) => (val === '' || val === null || val === undefined) ? null : new Date(val as string),
    z.date().nullable().optional()
  ),
})

// Tech Stats
export const techStatsSchema = z.object({
  iconType: z.enum(['library', 'upload']).default('library'),
  icon: z.string().optional().default(''),
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  order: z.number().default(0).optional(),
  active: z.boolean().default(true).optional(),
  deletedAt: z.preprocess(
    (val) => (val === '' || val === null || val === undefined) ? null : new Date(val as string),
    z.date().nullable().optional()
  ),
})

// Project
export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().optional().default(''),
  thumbnail: z.object({
    image: z.string().optional().default(''),
    alt: z.string().optional().default(''),
  }).optional().default({ image: '', alt: '' }),
  gallery: z.array(z.object({
    image: z.string(),
    alt: z.string().optional().default(''),
  })).optional().default([]),
  architectureDiagram: z.string().optional().default(''),
  category: z.string().optional().default(''),
  status: z.enum(['completed', 'in_progress', 'archived']).default('completed'),
  publishStatus: z.enum(['draft', 'preview', 'published']).default('draft'),
  featured: z.boolean().default(false),
  featuredOrder: z.number().default(0).optional(),
  isPublished: z.boolean().default(true),
  showOnHomepage: z.boolean().default(true),
  isCaseStudy: z.boolean().default(false),
  sortOrder: z.number().default(0).optional(),
  duration: z.string().optional().default(''),
  teamSize: z.string().optional().default(''),
  techStack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  searchKeywords: z.array(z.string()).default([]),
  keyMetrics: z.array(z.object({
    value: z.string().min(1, 'Metric value required'),
    label: z.string().min(1, 'Metric label required'),
  })).default([]),
  highlights: z.array(z.string()).default([]),
  problemStatement: z.string().optional().default(''),
  solution: z.string().optional().default(''),
  challenges: z.string().optional().default(''),
  outcomes: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  demoUrl: z.string().optional().default(''),
  documentationUrl: z.string().optional().default(''),
  videoDemoUrl: z.string().optional().default(''),
  showGithub: z.boolean().default(true),
  showDemo: z.boolean().default(true),
  showDocumentation: z.boolean().default(true),
  showVideoDemo: z.boolean().default(true),
  seoTitle: z.string().optional().default(''),
  seoDescription: z.string().optional().default(''),
  seoKeywords: z.array(z.string()).default([]),
})

// Certification
export const certificationSchema = z.object({
  title: z.string().min(3, 'Title required'),
  issuer: z.string().min(2, 'Issuer required'),
  logoMode: z.enum(['auto', 'custom']).default('auto'),
  logo: optionalUrl,
  logoAlt: z.string().optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).default([]),
  certificateUrl: optionalUrl,
  credentialUrl: optionalUrl,
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0).optional(),
  isPublished: z.boolean().default(true).optional(),
})

// Achievement Category
export const achievementCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  icon: z.string().optional().default(''),
  color: z.string().optional().default(''),
  description: z.string().optional().default(''),
  coverImage: z.string().optional().default(''),
  displayOrder: z.number().default(0).optional(),
  active: z.boolean().default(true).optional(),
})

// Achievement Settings
export const achievementSettingsSchema = z.object({
  title: z.string().min(1, 'Section title is required').default('ACHIEVEMENTS & AWARDS'),
  subtitle: z.string().optional().default(''),
  showCategoryGrid: z.boolean().default(true),
  animationsEnabled: z.boolean().default(true),
})

// Achievement
export const achievementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  organization: z.string().optional().default(''),
  description: z.string().optional().default(''),
  date: z.string().min(1, 'Date is required'),
  year: z.string().min(4, 'Year is required'),
  category: z.string().min(1, 'Category ID reference is required'),
  icon: z.string().optional().default(''),
  badgeColor: z.string().optional().default(''),
  showInCategory: z.boolean().default(true),
  displayOrder: z.number().default(0).optional(),
  achievementImage: z.string().optional().default(''),
  achievementUrl: optionalUrl,
  tags: z.array(z.string()).default([]),
  metricValue: z.string().optional().default(''),
  metricLabel: z.string().optional().default(''),
})

// Contact Message
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})


// Admin User
export const adminUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name required'),
})

// Login
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})


const resumeSkillSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
})

const resumeProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  technologies: z.string().optional().default(''),
  bullets: z.array(z.string()).optional().default([]),
})

const resumeExperienceSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  duration: z.string().optional().default(''),
  bullets: z.array(z.string()).optional().default([]),
})

const resumeEducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  duration: z.string().optional().default(''),
  coursework: z.string().optional().default(''),
  description: z.string().optional().default(''),
  bullets: z.array(z.string()).optional().default([]),
})

const resumeSoftSkillSchema = z.object({
  title: z.string().min(1, 'Soft skill title is required'),
  description: z.string().optional().default(''),
})

export const resumeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').or(z.literal('')).optional().default(''),
  phone: z.string().optional().default(''),
  github: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  address: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  skills: z.array(resumeSkillSchema).optional().default([]),
  projects: z.array(resumeProjectSchema).optional().default([]),
  experience: z.array(resumeExperienceSchema).optional().default([]),
  education: z.array(resumeEducationSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  softSkills: z.array(resumeSoftSkillSchema).optional().default([]),
})

// Type exports
export type Profile = z.infer<typeof profileSchema>
export type TechStackSettings = z.infer<typeof techStackSettingsSchema>
export type TechnologyCategory = z.infer<typeof technologyCategorySchema>
export type Technology = z.infer<typeof technologySchema>
export type TechStats = z.infer<typeof techStatsSchema>
export type Project = z.infer<typeof projectSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Achievement = z.infer<typeof achievementSchema>
export type AchievementCategory = z.infer<typeof achievementCategorySchema>
export type AchievementSettings = z.infer<typeof achievementSettingsSchema>
export type ContactMessage = z.infer<typeof contactMessageSchema>
export type AdminUser = z.infer<typeof adminUserSchema>
export type Login = z.infer<typeof loginSchema>

export type Resume = z.infer<typeof resumeSchema>

/**
 * Safe parse with error handling for API routes
 */
export const safeParse = <T>(schema: z.Schema<T>, data: unknown) => {
  const result = schema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : null,
    error: !result.success ? result.error.flatten().fieldErrors : null,
  }
}
