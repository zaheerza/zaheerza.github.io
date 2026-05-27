'use client'

import { TrendItem } from '../types/trend'

interface Props {
  activeSources: Set<TrendItem['source']>
  onToggleSource: (source: TrendItem['source']) => void
  geo: string
  onGeoChange: (geo: string) => void
}

const SOURCES: Array<{ id: TrendItem['source']; label: string; color: string }> = [
  { id: 'wikipedia', label: 'Wikipedia', color: '#4A9EFF' },
  { id: 'reddit', label: 'Reddit', color: '#FF5700' },
  { id: 'google_trends', label: 'Google', color: '#34A853' },
]

const GEO_OPTIONS = [
  { value: 'US', label: 'US' },
  { value: 'GB', label: 'UK' },
  { value: 'CA', label: 'CA' },
]

export function FilterBar({ activeSources, onToggleSource, geo, onGeoChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-[#1a1a1a] text-[10px] font-mono">
      <span className="text-[#444]">SOURCES</span>
      <div className="flex items-center gap-2">
        {SOURCES.map((s) => {
          const active = activeSources.has(s.id)
          return (
            <button
              key={s.id}
              onClick={() => onToggleSource(s.id)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-sm border transition-all cursor-pointer"
              style={{
                borderColor: active ? s.color + '66' : '#333',
                color: active ? s.color : '#555',
                backgroundColor: active ? s.color + '11' : 'transparent',
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <span className="text-[#333]">|</span>
      <span className="text-[#444]">GEO</span>
      <div className="flex items-center gap-1">
        {GEO_OPTIONS.map((g) => (
          <button
            key={g.value}
            onClick={() => onGeoChange(g.value)}
            className="px-2 py-0.5 rounded-sm border transition-all cursor-pointer"
            style={{
              borderColor: geo === g.value ? '#4A9EFF66' : '#333',
              color: geo === g.value ? '#4A9EFF' : '#555',
              backgroundColor: geo === g.value ? '#4A9EFF11' : 'transparent',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  )
}
