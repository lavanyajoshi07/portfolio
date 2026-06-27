import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username) {
    return new NextResponse('Username query parameter is required', { status: 400 })
  }

  try {
    const res = await fetch(`https://ghchart.rshah.org/5568FE/${username}`)
    if (!res.ok) {
      return new NextResponse('Failed to fetch from ghchart.rshah.org', { status: res.status })
    }
    const svgText = await res.text()
    
    return new NextResponse(svgText, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error in github-chart API route:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
