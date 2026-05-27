import { TrendItem } from '../types/trend'
import { VelocityBadge } from './VelocityBadge'

const SOURCE_ABBR: Record<TrendItem['source'], string> = {
  wikipedia: 'WP',
  reddit: 'RD',
  google_trends: 'GT',
}

const SOURCE_COLOR: Record<TrendItem['source'], string> = {
  wikipedia: '#4A9EFF',
  reddit: '#FF5700',
  google_trends: '#34A853',
}

interface Props {
  items: TrendItem[]
  loading: boolean
}

export function UnifiedFeed({ items, loading }: Props) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 pb-12">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-xs font-mono font-bold tracking-widest text-[#888]">
          UNIFIED FEED
        </h2>
        <span className="text-[10px] text-[#444] font-mono">
          Cross-source signals ranked by velocity
        </span>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-48 h-16 bg-[#111] border border-[#222] rounded-sm animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-[#555]">No unified signals yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {items.slice(0, 10).map((item, i) => {
            const color = SOURCE_COLOR[item.source]
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 border border-[#1a1a1a] hover:border-[#2a2a2a] bg-[#0d0d0d] hover:bg-[#111] transition-all p-3 rounded-sm"
              >
                <span className="font-mono text-sm text-[#333] w-5 text-right shrink-0">
                  #{i + 1}
                </span>
                <span
                  className="font-mono text-[9px] font-bold border px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{ color, borderColor: color + '44', backgroundColor: color + '11' }}
                >
                  {SOURCE_ABBR[item.source]}
                </span>
                <span className="flex-1 min-w-0 text-[13px] text-[#D0D0D0] truncate group-hover:underline">
                  {item.title}
                </span>
                <div className="shrink-0">
                  <VelocityBadge velocity={item.velocity} source={item.source} />
                </div>
                {item.isBreaking && (
                  <span className="shrink-0 text-[9px] font-mono text-[#FF3B30] border border-[#FF3B30]/30 bg-[#FF3B30]/10 px-1.5 py-0.5 rounded-sm">
                    LIVE
                  </span>
                )}
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
