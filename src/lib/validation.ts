import { z } from 'zod'

// A URL field that also accepts an empty string (so untouched optional inputs
// don't block submission). `.optional()` alone only allows `undefined`, NOT ''.
// A preprocessor helper for optional URLs to handle null, undefined, and empty string
const optionalUrl = z.preprocess(
  (val) => (val === '' || val === null || val === undefined) ? undefined : val,
  z.string().url('Must be a valid URL').optional()
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

const educationItemSchema = z.object({
  institution: optionalString,
  degree: optionalString,
  field: optionalString,
  startYear: optionalNumber,
  endYear: optionalNumber,
  current: z.preprocess((val) => val === null ? undefined : val, z.boolean().optional()),
  gpa: optionalString,
  description: optionalString,
})

// Profile
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  bio: optionalString,
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
    })
    .optional(),
  education: z.array(educationItemSchema).optional(),
  careerGoals: optionalString,
  learningJourney: optionalString,
})

// Skill
export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name required'),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'ai_ml', 'tools', 'languages', 'mobile', 'other']),
  level: z.number().min(0).max(100),
  yearsOfExperience: z.number().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
})

// Project
export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  technologies: z.array(z.string()),
  category: z.string().optional(),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  liveUrl: z.string().url().or(z.literal('')).optional(),
  featured: z.boolean().default(false),
  status: z.enum(['completed', 'in_progress', 'archived']).default('completed'),
  coverImage: z.string().optional(),
  projectImage: optionalUrl,
})

// Certification
export const certificationSchema = z.object({
  title: z.string().min(3, 'Title required'),
  issuer: z.string().min(2, 'Issuer required'),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  certificateImage: optionalUrl,
  skills: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
})

// Achievement
export const achievementSchema = z.object({
  title: z.string().min(3, 'Title required'),
  description: z.string().optional(),
  type: z.enum(['hackathon', 'competition', 'leadership', 'academic', 'award', 'other']),
  date: z.string(),
  position: z.string().optional(),
  organizer: z.string().optional(),
})

// Timeline
export const timelineSchema = z.object({
  title: z.string().min(3, 'Title required'),
  description: z.string().optional(),
  type: z.enum(['education', 'project', 'achievement', 'milestone', 'work']),
  date: z.string(),
  tags: z.array(z.string()).optional(),
})

// Contact Message
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

// Chat Message
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message required').max(5000),
  sessionId: z.string(),
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

// Coding Profile
export const codingProfileSchema = z.object({
  platform: z.enum(['github', 'leetcode', 'hackerrank', 'codechef', 'codeforces', 'other']),
  username: z.string().min(1, 'Username required'),
  enabled: z.boolean().default(true),
})

// Type exports
export type Profile = z.infer<typeof profileSchema>
export type Skill = z.infer<typeof skillSchema>
export type Project = z.infer<typeof projectSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Achievement = z.infer<typeof achievementSchema>
export type Timeline = z.infer<typeof timelineSchema>
export type ContactMessage = z.infer<typeof contactMessageSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type AdminUser = z.infer<typeof adminUserSchema>
export type Login = z.infer<typeof loginSchema>
export type CodingProfile = z.infer<typeof codingProfileSchema>

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
