import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 300

interface ContributionDay {
  contributionCount: number
  date: string
}

function calculateStreaks(weeks: { contributionDays: ContributionDay[] }[]) {
  const allDays: ContributionDay[] = []
  for (const week of weeks) {
    if (week.contributionDays) {
      allDays.push(...week.contributionDays)
    }
  }
  
  // Sort by date ascending
  allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0
  let activeDays = 0
  
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      activeDays++
      tempStreak++
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
    } else {
      tempStreak = 0
    }
  }
  
  // Calculate current streak walking backward from the last elements
  // Allow today to be 0 if yesterday was active.
  let todayIndex = allDays.length - 1
  if (todayIndex >= 0 && allDays[todayIndex].contributionCount === 0) {
    todayIndex--
  }
  
  for (let i = todayIndex; i >= 0; i--) {
    if (allDays[i].contributionCount > 0) {
      currentStreak++
    } else {
      break
    }
  }
  
  return {
    longestStreak,
    currentStreak,
    activeDays
  }
}

export async function GET() {
  const username = 'lavanyajoshi07'
  const token = process.env.GITHUB_TOKEN

  console.log(`GitHub API: Starting stats request for username: '${username}'`)
  console.log('GitHub API: GITHUB_TOKEN environment variable is', token ? 'PRESENT' : 'MISSING')

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'lavanyajoshi07-portfolio',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    // 1. Fetch REST API Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 60 }
    })
    
    if (!profileRes.ok) {
      console.error(`GitHub API Error: Profile fetch failed with status ${profileRes.status} (${profileRes.statusText})`)
      throw new Error(`GitHub REST Profile API error: ${profileRes.statusText}`)
    }
    const profileData = await profileRes.json()
    console.log('GitHub API: Profile details fetched successfully.')

    // 2. Fetch REST API Repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers,
      next: { revalidate: 60 }
    })
    if (!reposRes.ok) {
      console.warn(`GitHub API Warning: Repos fetch returned status ${reposRes.status} (${reposRes.statusText})`)
    } else {
      console.log('GitHub API: Repos list fetched successfully.')
    }
    const reposData = await reposRes.json()

    // Default fallbacks for streak/contribution info
    let totalContributions = 0
    let currentStreak = 0
    let longestStreak = 0
    let activeDays = 0

    // 3. Fetch GraphQL API for contributions calendar
    if (token) {
      try {
        console.log('GitHub API: Querying GraphQL contributions calendar...')
        const graphqlQuery = {
          query: `
            query($username: String!) {
              user(login: $username) {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { username }
        }

        const graphqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'lavanyajoshi07-portfolio'
          },
          body: JSON.stringify(graphqlQuery),
          next: { revalidate: 60 }
        })

        if (graphqlRes.ok) {
          const graphqlData = await graphqlRes.json()
          if (graphqlData?.errors) {
            console.error('GitHub API Error: GraphQL query returned errors:', JSON.stringify(graphqlData.errors))
          }
          const calendar = graphqlData?.data?.user?.contributionsCollection?.contributionCalendar
          if (calendar) {
            totalContributions = calendar.totalContributions || 0
            const streaks = calculateStreaks(calendar.weeks || [])
            currentStreak = streaks.currentStreak
            longestStreak = streaks.longestStreak
            activeDays = streaks.activeDays
            console.log(`GitHub API: GraphQL stats retrieved successfully. Total Contributions: ${totalContributions}, Streak: ${currentStreak}`)
          } else {
            console.warn('GitHub API Warning: GraphQL calendar data not found in response.')
          }
        } else {
          console.error('GitHub API Error: GraphQL request failed with status', graphqlRes.status, graphqlRes.statusText)
        }
      } catch (gqlErr) {
        console.error('GitHub API Error: Failed to fetch/calculate GraphQL stats:', gqlErr)
      }
    } else {
      console.warn('GitHub API Warning: Skipping GraphQL calendar query because GITHUB_TOKEN is not set.')
    }

    console.log('GitHub API: Completed successfully, returning collected statistics.')
    return NextResponse.json({
      followers: profileData.followers || 0,
      following: profileData.following || 0,
      public_repos: profileData.public_repos || 0,
      totalContributions,
      currentStreak,
      longestStreak,
      activeDays
    })
  } catch (error: any) {
    console.error('GitHub API Error: Unhandled error fetching GitHub data:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
