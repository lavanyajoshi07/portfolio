import { z } from 'zod'

// Profile
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  bio: z.string().optional(),
  email: z.string().email('Invalid email address'),
  location: z.string().optional(),
  profileImage: z.string().url().optional(),
  heroVideo: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
  yearsOfExperience: z.number().min(0).optional(),
  isAvailableForWork: z.boolean().default(true),
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
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['completed', 'in_progress', 'archived']).default('completed'),
})

// Certification
export const certificationSchema = z.object({
  title: z.string().min(3, 'Title required'),
  issuer: z.string().min(2, 'Issuer required'),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url().optional(),
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

// Type exports for convenience
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
 * Safe parse with error handling
 */
export const safeParse = <T>(schema: z.Schema<T>, data: unknown) => {
  const result = schema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : null,
    error: !result.success ? result.error.flatten().fieldErrors : null,
  }
}