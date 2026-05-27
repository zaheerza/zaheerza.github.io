import { fetchWikipediaVelocity } from '../../lib/wikipedia'
import { fetchRedditRising } from '../../lib/reddit'
import { fetchGoogleTrends } from '../../lib/googletrends'
import { mergeAndRankTrends } from '../../lib/scoring'

export const revalidate = 900

export async function GET() {
  try {
    const [wikipedia, reddit, googleTrends] = await Promise.allSettled([
      fetchWikipediaVelocity(20),
      fetchRedditRising(30),
      fetchGoogleTrends('US', 20),
    ])

    const wp = wikipedia.status === 'fulfilled' ? wikipedia.value : []
    const rd = reddit.status === 'fulfilled' ? reddit.value : []
    const gt = googleTrends.status === 'fulfilled' ? googleTrends.value : []

    const unified = mergeAndRankTrends(wp, rd, gt)

    return Response.json(
      {
        wikipedia: wp,
        reddit: rd,
        googleTrends: gt,
        unified,
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      }
    )
  } catch (err) {
    console.error('Unified API error:', err)
    return Response.json(
      {
        error: 'Failed to fetch unified data',
        wikipedia: [],
        reddit: [],
        googleTrends: [],
        unified: [],
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
