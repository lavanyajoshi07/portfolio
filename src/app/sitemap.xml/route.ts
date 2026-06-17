import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Profile } from '@/models'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Get website URL from request or fallback
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  
  let websiteUrl = `${protocol}://${host}`
  let resumeUrl = ''

  try {
    await connectDB()
    const profile = (await Profile.findOne().lean()) as any
    if (profile) {
      if (profile.socialLinks?.website) {
        // Use the configured website URL, stripping trailing slash if present
        websiteUrl = profile.socialLinks.website.replace(/\/$/, '')
      }
      if (profile.resumeUrl) {
        resumeUrl = profile.resumeUrl
      }
    }
  } catch (error) {
    console.error('Error fetching profile for sitemap:', error)
  }

  // Ensure websiteUrl has a protocol prefix
  if (!/^https?:\/\//i.test(websiteUrl)) {
    websiteUrl = `https://${websiteUrl}`
  }

  const currentDate = new Date().toISOString()

  // Define the public paths requested by the user
  const pages = [
    { loc: `${websiteUrl}/`, lastmod: currentDate, changefreq: 'daily', priority: '1.0' },
    { loc: `${websiteUrl}/about`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${websiteUrl}/techstack`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${websiteUrl}/projects`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${websiteUrl}/certificates`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
    { loc: `${websiteUrl}/contact`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
  ]

  // Add the resume page if resumeUrl exists in profile
  if (resumeUrl) {
    pages.push({ loc: `${websiteUrl}/resume`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' })
  }

  const xmlItems = pages
    .map(
      (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
