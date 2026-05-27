import { TrendItem } from '../types/trend'

const NOISE_FILTER = new Set([
  'Main_Page', 'Special:Search', 'Wikipedia:Featured_pictures',
  'United_States', 'United_Kingdom', 'India', 'Deaths_in_2025',
  'Deaths_in_2026', 'Portal:Current_events', 'List_of_countries',
])

function isNoise(article: string): boolean {
  if (NOISE_FILTER.has(article)) return true
  if (article.startsWith('Special:')) return true
  if (article.startsWith('Wikipedia:')) return true
  if (article.startsWith('Help:')) return true
  if (article.startsWith('Portal:')) return true
  if (article.startsWith('Template:')) return true
  return false
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
}

async function fetchTopArticles(dateStr: string): Promise<Map<string, number>> {
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${dateStr}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TrendPulse/1.0' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`)
  const data = await res.json()
  const map = new Map<string, number>()
  const articles: Array<{ article: string; views: number }> = data?.items?.[0]?.articles ?? []
  for (const a of articles) {
    if (!isNoise(a.article)) {
      map.set(a.article, a.views)
    }
  }
  return map
}

export async function fetchWikipediaVelocity(limit = 20): Promise<TrendItem[]> {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const twoDaysAgo = new Date(now)
  twoDaysAgo.setDate(now.getDate() - 2)

  const [todayMap, yesterdayMap] = await Promise.all([
    fetchTopArticles(formatDate(yesterday)),
    fetchTopArticles(formatDate(twoDaysAgo)),
  ])

  const results: TrendItem[] = []

  for (const [article, views] of todayMap) {
    const viewsYesterday = yesterdayMap.get(article) ?? 0
    if (viewsYesterday === 0) continue
    const velocity = ((views - viewsYesterday) / viewsYesterday) * 100

    results.push({
      id: `wp-${article}`,
      title: article.replace(/_/g, ' '),
      source: 'wikipedia',
      score: views,
      velocity,
      url: `https://en.wikipedia.org/wiki/${article}`,
      metadata: { views, viewsYesterday },
      timestamp: new Date().toISOString(),
      isBreaking: velocity > 400,
    })
  }

  results.sort((a, b) => b.velocity - a.velocity)
  return results.slice(0, limit)
}
