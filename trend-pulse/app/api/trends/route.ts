import { type NextRequest } from 'next/server'
import { fetchGoogleTrends } from '../../lib/googletrends'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  const geo = request.nextUrl.searchParams.get('geo') ?? 'US'

  try {
    const items = await fetchGoogleTrends(geo, 20)
    return Response.json(
      { items, lastUpdated: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch (err) {
    console.error('Google Trends API error:', err)
    return Response.json(
      { error: 'Failed to fetch Google Trends data', items: [], lastUpdated: new Date().toISOString() },
      { status: 500 }
    )
  }
}
