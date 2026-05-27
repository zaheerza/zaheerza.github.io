import { TrendItem } from '../types/trend'

const USER_AGENT = process.env.REDDIT_USER_AGENT ?? 'TrendPulse/1.0'
const SUBREDDITS = ['all', 'technology', 'worldnews', 'science', 'business']

interface RedditPost {
  id: string
  title: string
  subreddit: string
  score: number
  upvote_ratio: number
  num_comments: number
  url: string
  permalink: string
  created_utc: number
}

async function fetchRising(subreddit: string, limit = 10): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/rising.json?limit=${limit}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 900 },
    })
    if (!res.ok) {
      // Fallback to hot if rising is blocked
      const fallback = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
        { headers: { 'User-Agent': USER_AGENT }, next: { revalidate: 900 } }
      )
      if (!fallback.ok) return []
      const data = await fallback.json()
      return data?.data?.children?.map((c: { data: RedditPost }) => c.data) ?? []
    }
    const data = await res.json()
    return data?.data?.children?.map((c: { data: RedditPost }) => c.data) ?? []
  } catch {
    return []
  }
}

export async function fetchRedditRising(limit = 30): Promise<TrendItem[]> {
  const results = await Promise.all(SUBREDDITS.map((sr) => fetchRising(sr, 10)))
  const seen = new Set<string>()
  const items: TrendItem[] = []

  for (const posts of results) {
    for (const post of posts) {
      if (seen.has(post.id)) continue
      seen.add(post.id)

      const hoursOld = Math.max((Date.now() / 1000 - post.created_utc) / 3600, 0.1)
      const velocity = post.score / hoursOld

      items.push({
        id: `reddit-${post.id}`,
        title: post.title,
        source: 'reddit',
        score: post.score,
        velocity,
        url: `https://reddit.com${post.permalink}`,
        metadata: {
          subreddit: post.subreddit,
          upvoteRatio: post.upvote_ratio,
          comments: post.num_comments,
        },
        timestamp: new Date(post.created_utc * 1000).toISOString(),
        isBreaking: velocity > 500,
      })
    }
  }

  items.sort((a, b) => b.velocity - a.velocity)
  return items.slice(0, limit)
}
