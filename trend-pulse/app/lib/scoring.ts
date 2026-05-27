import { TrendItem } from '../types/trend'
import { VelocityInfo } from '../types/trend'

export function normalizeWikipediaScore(velocity: number): number {
  return Math.min((velocity / 500) * 100, 100)
}

export function normalizeRedditScore(upvotesPerHour: number): number {
  return Math.min((upvotesPerHour / 1000) * 100, 100)
}

export function normalizeGoogleTrendsScore(traffic: number): number {
  return Math.min((traffic / 1_000_000) * 100, 100)
}

const SOURCE_WEIGHT: Record<TrendItem['source'], number> = {
  wikipedia: 0.35,
  reddit: 0.40,
  google_trends: 0.25,
}

export function computeUnifiedScore(item: TrendItem): number {
  let normalized: number
  if (item.source === 'wikipedia') {
    normalized = normalizeWikipediaScore(item.velocity)
  } else if (item.source === 'reddit') {
    normalized = normalizeRedditScore(item.velocity)
  } else {
    normalized = normalizeGoogleTrendsScore(item.score)
  }
  return normalized * SOURCE_WEIGHT[item.source]
}

export function getVelocityInfo(velocity: number, source: TrendItem['source']): VelocityInfo {
  // For Google Trends, velocity is traffic/24; scale differently
  const v = source === 'google_trends' ? velocity / 1000 : velocity

  if (v > 400) return { label: 'BREAKING', color: '#FF3B30', icon: '🔥' }
  if (v > 200) return { label: 'SURGING', color: '#FF9500', icon: '📈' }
  if (v > 100) return { label: 'RISING', color: '#34C759', icon: '⬆️' }
  if (v > 50) return { label: 'BUILDING', color: '#4A9EFF', icon: '📊' }
  return { label: 'EARLY', color: '#888888', icon: '👁' }
}

export function mergeAndRankTrends(
  wikipedia: TrendItem[],
  reddit: TrendItem[],
  googleTrends: TrendItem[]
): TrendItem[] {
  const all = [...wikipedia, ...reddit, ...googleTrends]
  return all
    .map((item) => ({ ...item, _unified: computeUnifiedScore(item) }))
    .sort((a, b) => (b as TrendItem & { _unified: number })._unified - (a as TrendItem & { _unified: number })._unified)
    .slice(0, 30)
    .map(({ ...item }) => item as TrendItem)
}
