import { TrendItem } from '../types/trend'
import { TrendCard } from './TrendCard'
import { LoadingSkeleton } from './LoadingSkeleton'

const SOURCE_META = {
  wikipedia: {
    label: 'WIKIPEDIA',
    subtitle: 'Surging Now',
    color: '#4A9EFF',
    borderColor: '#4A9EFF22',
  },
  reddit: {
    label: 'REDDIT RISING',
    subtitle: 'Before Viral',
    color: '#FF5700',
    borderColor: '#FF570022',
  },
  google_trends: {
    label: 'GOOGLE TRENDS',
    subtitle: 'Searching Now',
    color: '#34A853',
    borderColor: '#34A85322',
  },
}

interface Props {
  source: TrendItem['source']
  items: TrendItem[]
  loading: boolean
  error?: string | null
  stale?: boolean
}

export function SourceColumn({ source, items, loading, error, stale }: Props) {
  const meta = SOURCE_META[source]

  return (
    <div className="flex flex-col min-w-0">
      <div
        className="flex items-baseline justify-between px-1 pb-3 mb-3 border-b"
        style={{ borderColor: meta.borderColor }}
      >
        <div>
          <h2
            className="text-xs font-mono font-bold tracking-widest"
            style={{ color: meta.color }}
          >
            {meta.label}
          </h2>
          <p className="text-[10px] mt-0.5" style={{ color: '#555' }}>
            {meta.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stale && (
            <span className="text-[9px] font-mono text-[#888] border border-[#333] px-1 py-0.5 rounded">
              CACHED
            </span>
          )}
          <span
            className="text-[9px] font-mono"
            style={{ color: meta.color + '88' }}
          >
            {items.length} signals
          </span>
        </div>
      </div>

      {error && !loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="text-xs text-[#888]">Data unavailable</p>
          <p className="text-[10px] text-[#555]">{error}</p>
        </div>
      ) : loading ? (
        <LoadingSkeleton count={6} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <span className="text-2xl">📭</span>
          <p className="text-xs text-[#888]">No signals detected</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <TrendCard key={item.id} item={item} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
