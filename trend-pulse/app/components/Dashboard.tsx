'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TrendItem, TrendFeed } from '../types/trend'
import { Header } from './Header'
import { FilterBar } from './FilterBar'
import { SourceColumn } from './SourceColumn'
import { UnifiedFeed } from './UnifiedFeed'

const AUTO_REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes

type TabSource = TrendItem['source'] | 'unified'

const MOBILE_TABS: Array<{ id: TabSource; label: string }> = [
  { id: 'wikipedia', label: 'Wikipedia' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'google_trends', label: 'Google' },
  { id: 'unified', label: 'Unified' },
]

export function Dashboard() {
  const [feed, setFeed] = useState<Partial<TrendFeed>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeSources, setActiveSources] = useState<Set<TrendItem['source']>>(
    new Set(['wikipedia', 'reddit', 'google_trends'])
  )
  const [geo, setGeo] = useState('US')
  const [mobileTab, setMobileTab] = useState<TabSource>('wikipedia')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/unified?geo=${geo}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: TrendFeed = await res.json()
      setFeed(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [geo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    timerRef.current = setTimeout(() => fetchData(true), AUTO_REFRESH_INTERVAL)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [autoRefresh, feed, fetchData])

  function toggleSource(source: TrendItem['source']) {
    setActiveSources((prev) => {
      const next = new Set(prev)
      if (next.has(source)) {
        if (next.size > 1) next.delete(source)
      } else {
        next.add(source)
      }
      return next
    })
  }

  const wp = (feed.wikipedia ?? []).filter(() => activeSources.has('wikipedia'))
  const rd = (feed.reddit ?? []).filter(() => activeSources.has('reddit'))
  const gt = (feed.googleTrends ?? []).filter(() => activeSources.has('google_trends'))
  const unified = feed.unified ?? []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F5F5F5]">
      <Header
        lastUpdated={feed.lastUpdated}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
        onRefresh={() => fetchData(true)}
        refreshing={refreshing}
      />
      <FilterBar
        activeSources={activeSources}
        onToggleSource={toggleSource}
        geo={geo}
        onGeoChange={(g) => setGeo(g)}
      />

      {error && (
        <div className="max-w-[1400px] mx-auto px-4 pt-4">
          <div className="border border-[#FF3B30]/30 bg-[#FF3B30]/5 rounded-sm px-4 py-3 text-xs font-mono text-[#FF3B30]">
            ⚠ Feed error: {error}. Showing cached data if available.
          </div>
        </div>
      )}

      {/* Mobile tabs */}
      <div className="lg:hidden border-b border-[#1a1a1a] flex">
        {MOBILE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setMobileTab(t.id)}
            className={`flex-1 py-2 text-[10px] font-mono tracking-wider transition-colors cursor-pointer ${
              mobileTab === t.id
                ? 'text-[#F5F5F5] border-b-2 border-[#4A9EFF]'
                : 'text-[#555]'
            }`}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="lg:hidden max-w-[1400px] mx-auto px-4 pt-6">
        {mobileTab === 'wikipedia' && (
          <SourceColumn source="wikipedia" items={wp} loading={loading} error={error} />
        )}
        {mobileTab === 'reddit' && (
          <SourceColumn source="reddit" items={rd} loading={loading} error={error} />
        )}
        {mobileTab === 'google_trends' && (
          <SourceColumn source="google_trends" items={gt} loading={loading} error={error} />
        )}
        {mobileTab === 'unified' && (
          <UnifiedFeed items={unified} loading={loading} />
        )}
      </div>

      {/* Desktop: three-column */}
      <main className="hidden lg:block max-w-[1400px] mx-auto px-4 pt-6 pb-6">
        <div className="grid grid-cols-3 gap-6">
          <SourceColumn source="wikipedia" items={wp} loading={loading} error={error} />
          <SourceColumn source="reddit" items={rd} loading={loading} error={error} />
          <SourceColumn source="google_trends" items={gt} loading={loading} error={error} />
        </div>
      </main>

      {/* Unified feed - both mobile (non-tab) and desktop */}
      <div className="hidden lg:block border-t border-[#1a1a1a] pt-6 mt-2">
        <UnifiedFeed items={unified} loading={loading} />
      </div>
    </div>
  )
}
