import { TrendItem } from '../types/trend'

const RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US'

export function parseTrafficString(traffic: string): number {
  const s = traffic.replace(/[^0-9KMB]/gi, '')
  const num = parseFloat(s)
  if (isNaN(num)) return 0
  if (s.toUpperCase().includes('B')) return num * 1_000_000_000
  if (s.toUpperCase().includes('M')) return num * 1_000_000
  if (s.toUpperCase().includes('K')) return num * 1_000
  return num
}

function extractText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = xml.match(re)
  return (m?.[1] ?? m?.[2] ?? '').trim()
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i')
  return xml.match(re)?.[1] ?? ''
}

export async function fetchGoogleTrends(geo = 'US', limit = 20): Promise<TrendItem[]> {
  const url = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TrendPulse/1.0', Accept: 'application/rss+xml' },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Google Trends RSS error: ${res.status}`)
  const text = await res.text()

  // Split by <item> tags
  const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) ?? []
  const items: TrendItem[] = []

  for (const itemXml of itemMatches.slice(0, limit)) {
    const title = extractText(itemXml, 'title')
    const link = extractText(itemXml, 'link') || extractAttr(itemXml, 'link', 'href')
    const trafficRaw = extractText(itemXml, 'ht:approx_traffic')
    const traffic = parseTrafficString(trafficRaw)

    if (!title) continue

    // Velocity: normalize traffic to upvotes-per-hour-like scale
    // Google Trends traffic is daily, so divide by 24
    const velocity = traffic / 24

    items.push({
      id: `gt-${Buffer.from(title).toString('base64').slice(0, 12)}`,
      title,
      source: 'google_trends',
      score: traffic,
      velocity,
      url: link || `https://trends.google.com/trends/explore?q=${encodeURIComponent(title)}&geo=${geo}`,
      metadata: { approximateTraffic: trafficRaw || `${traffic.toLocaleString()}+` },
      timestamp: new Date().toISOString(),
      isBreaking: traffic > 500_000,
    })
  }

  return items
}
