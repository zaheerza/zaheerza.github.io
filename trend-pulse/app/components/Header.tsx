'use client'

import { useEffect, useState } from 'react'

interface Props {
  lastUpdated?: string
  autoRefresh: boolean
  onToggleAutoRefresh: () => void
  onRefresh: () => void
  refreshing: boolean
}

export function Header({ lastUpdated, autoRefresh, onToggleAutoRefresh, onRefresh, refreshing }: Props) {
  const [now, setNow] = useState('')

  useEffect(() => {
    function tick() {
      setNow(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  const lastUpdatedStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-mono font-bold tracking-widest text-[#F5F5F5]">
            TREND PULSE
          </h1>
          <span className="hidden sm:block text-[10px] font-mono text-[#444] border border-[#222] px-2 py-0.5 rounded-sm">
            CULTURAL INTELLIGENCE FEED
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          {lastUpdatedStr && (
            <span className="text-[#555]">
              updated {lastUpdatedStr}
            </span>
          )}

          <button
            onClick={onToggleAutoRefresh}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border transition-colors cursor-pointer ${
              autoRefresh
                ? 'border-[#34C759]/40 text-[#34C759] bg-[#34C759]/10'
                : 'border-[#333] text-[#555]'
            }`}
          >
            <span className={autoRefresh ? 'animate-pulse' : ''}>●</span>
            {autoRefresh ? 'AUTO 15min' : 'MANUAL'}
          </button>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-[#333] text-[#888] hover:border-[#444] hover:text-[#aaa] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={refreshing ? 'animate-spin' : ''}>↻</span>
            REFRESH
          </button>

          <span className="hidden md:block text-[#333]">
            {now}
          </span>
        </div>
      </div>
    </header>
  )
}
