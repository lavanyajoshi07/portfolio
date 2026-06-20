import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { CodingActivitySettings } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    let settings = await CodingActivitySettings.findOne().lean()

    if (!settings) {
      settings = await CodingActivitySettings.create({
        title: 'Coding Activity',
        subtitle: 'Real-time stats from GitHub, LeetCode, and other platforms',
        problemsSolved: '312',
        problemsSolvedSource: 'LeetCode • Codeforces',
        contributions: '314',
        contributionsSource: 'Total Contributions',
        publicRepos: '15',
        publicReposSource: 'GitHub',
        followers: '128',
        followersSource: 'GitHub',
        contributionGraphImage: '',
        contributionGraphAlt: 'GitHub Contribution Graph',
        graphImageDisplayMode: 'cover',
        totalContributions: '314',
        currentStreak: '12',
        longestStreak: '25',
        activeDays: '150',
        profileImage: '',
        profileName: 'Your Name',
        profileUsername: 'username',
        profileBio: 'Software Engineer',
        githubFollowers: '128',
        githubFollowing: '45',
        githubRepos: '15',
        githubContributions: '314',
        githubCurrentStreak: '12',
        githubProfileUrl: 'https://github.com',
        motivationalQuote: 'Consistency compounds faster than talent.',
        motivationalIcon: 'Activity',
        motivationalEmoji: '⚡',
        showOverviewCards: true,
        showContributionGraph: true,
        showGithubProfile: true,
        showMotivationalBanner: true,
      })
    }

    return successResponse(settings)
  } catch (error) {
    console.error('Error fetching coding activity settings:', error)
    return errorResponse('Failed to fetch settings', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    let settings = await CodingActivitySettings.findOne()

    if (!settings) {
      settings = await CodingActivitySettings.create(data)
    } else {
      Object.assign(settings, data)
      await settings.save()
    }

    revalidatePortfolio()
    return successResponse(settings, 'Coding activity settings updated successfully')
  } catch (error) {
    console.error('Error updating coding activity settings:', error)
    return errorResponse('Failed to update settings', 500)
  }
}
