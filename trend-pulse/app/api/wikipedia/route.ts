import { type NextRequest } from 'next/server'
import { fetchWikipediaVelocity } from '../../lib/wikipedia'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '20')

  try {
    const items = await fetchWikipediaVelocity(Math.min(limit, 50))
    return Response.json(
      { items, lastUpdated: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch (err) {
    console.error('Wikipedia API error:', err)
    return Response.json(
      { error: 'Failed to fetch Wikipedia data', items: [], lastUpdated: new Date().toISOString() },
      { status: 500 }
    )
  }
}
