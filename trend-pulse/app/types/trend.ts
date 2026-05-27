export interface TrendItem {
  id: string
  title: string
  source: 'wikipedia' | 'reddit' | 'google_trends'
  score: number
  velocity: number
  url: string
  category?: string
  metadata: {
    views?: number
    viewsYesterday?: number
    subreddit?: string
    upvoteRatio?: number
    comments?: number
    approximateTraffic?: string
  }
  timestamp: string
  isBreaking?: boolean
}

export interface TrendFeed {
  wikipedia: TrendItem[]
  reddit: TrendItem[]
  googleTrends: TrendItem[]
  lastUpdated: string
  unified: TrendItem[]
}

export interface VelocityInfo {
  label: string
  color: string
  icon: string
}
