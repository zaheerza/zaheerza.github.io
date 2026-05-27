import { type NextRequest } from 'next/server'
import { fetchRedditRising } from '../../lib/reddit'

export const revalidate = 900

export async function GET(request: NextRequest) {
  const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '30')

  try {
    const items = await fetchRedditRising(Math.min(limit, 50))
    return Response.json(
      { items, lastUpdated: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      }
    )
  } catch (err) {
    console.error('Reddit API error:', err)
    return Response.json(
      { error: 'Failed to fetch Reddit data', items: [], lastUpdated: new Date().toISOString() },
      { status: 500 }
    )
  }
}
