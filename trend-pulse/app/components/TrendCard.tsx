import { TrendItem } from '../types/trend'
import { VelocityBadge } from './VelocityBadge'
import { Sparkline } from './Sparkline'

const SOURCE_COLOR: Record<TrendItem['source'], string> = {
  wikipedia: '#4A9EFF',
  reddit: '#FF5700',
  google_trends: '#34A853',
}

function formatVelocity(item: TrendItem): string {
  if (item.source === 'wikipedia') {
    return `+${Math.round(item.velocity)}% views`
  }
  if (item.source === 'reddit') {
    return `${Math.round(item.velocity).toLocaleString()} ▲/hr`
  }
  return item.metadata.approximateTraffic
    ? `~${item.metadata.approximateTraffic} searches`
    : `${Math.round(item.score / 1000)}K searches`
}

function formatSubtitle(item: TrendItem): string | null {
  if (item.source === 'reddit' && item.metadata.subreddit) {
    return `r/${item.metadata.subreddit} · ${item.metadata.comments?.toLocaleString() ?? 0} comments`
  }
  if (item.source === 'wikipedia' && item.metadata.views) {
    return `${item.metadata.views.toLocaleString()} views today`
  }
  return null
}

interface Props {
  item: TrendItem
  rank: number
}

export function TrendCard({ item, rank }: Props) {
  const color = SOURCE_COLOR[item.source]
  const subtitle = formatSubtitle(item)

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-[#222] hover:border-[#333] bg-[#111] hover:bg-[#161616] transition-all duration-150 rounded-sm p-3 animate-fadeIn"
    >
      <div className="flex items-start gap-2">
        <span
          className="font-mono text-xs mt-0.5 shrink-0 w-5 text-right"
          style={{ color: '#444' }}
        >
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p
              className="text-[13px] font-medium leading-snug line-clamp-2 group-hover:underline"
              style={{ color: '#F5F5F5' }}
            >
              {item.title}
            </p>
            {item.isBreaking && (
              <span className="shrink-0 text-[9px] font-mono font-bold text-[#FF3B30] border border-[#FF3B30]/30 bg-[#FF3B30]/10 px-1.5 py-0.5 rounded-sm">
                LIVE
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex flex-col gap-1">
              <VelocityBadge velocity={item.velocity} source={item.source} />
              <span className="text-[11px] font-mono" style={{ color }}>
                {formatVelocity(item)}
              </span>
              {subtitle && (
                <span className="text-[10px]" style={{ color: '#888' }}>
                  {subtitle}
                </span>
              )}
            </div>
            {item.source === 'wikipedia' && (
              <div className="shrink-0">
                <Sparkline item={item} color={color} />
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
