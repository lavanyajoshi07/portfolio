import { z } from 'zod'

export const codingActivitySettingsSchema = z.object({
  title: z.string().min(1, 'Title required'),
  subtitle: z.string().optional().default(''),

  // Overview Cards
  problemsSolved: z.string().optional().default('—'),
  problemsSolvedSource: z.string().optional().default(''),
  contributions: z.string().optional().default('—'),
  contributionsSource: z.string().optional().default(''),
  publicRepos: z.string().optional().default('—'),
  publicReposSource: z.string().optional().default(''),
  followers: z.string().optional().default('—'),
  followersSource: z.string().optional().default(''),

  // Contribution Graph
  contributionGraphImage: z.string().optional().default(''),
  contributionGraphAlt: z.string().optional().default('GitHub Contribution Graph'),
  graphImageDisplayMode: z.enum(['cover', 'contain', 'fill']).default('cover'),

  // Mini Stats
  totalContributions: z.string().optional().default('—'),
  currentStreak: z.string().optional().default('—'),
  longestStreak: z.string().optional().default('—'),
  activeDays: z.string().optional().default('—'),

  // GitHub Profile
  profileImage: z.string().optional().default(''),
  profileName: z.string().min(1, 'Name required'),
  profileUsername: z.string().min(1, 'Username required'),
  profileBio: z.string().optional().default(''),

  githubFollowers: z.string().optional().default('—'),
  githubFollowing: z.string().optional().default('—'),
  githubRepos: z.string().optional().default('—'),
  githubContributions: z.string().optional().default('—'),
  githubCurrentStreak: z.string().optional().default('—'),

  githubProfileUrl: z.string().url('Must be a valid URL').or(z.literal('')),

  // Motivational Banner
  motivationalQuote: z.string().min(1, 'Quote required'),
  motivationalIcon: z.string().optional().default('Activity'),
  motivationalEmoji: z.string().optional().default('⚡'),

  // Visibility Toggles
  showOverviewCards: z.boolean().default(true),
  showContributionGraph: z.boolean().default(true),
  showGithubProfile: z.boolean().default(true),
  showMotivationalBanner: z.boolean().default(true),
})

export type CodingActivitySettings = z.infer<typeof codingActivitySettingsSchema>
