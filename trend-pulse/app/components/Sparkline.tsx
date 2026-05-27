'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendItem } from '../types/trend'

interface Props {
  item: TrendItem
  color: string
}

function generateSparklineData(item: TrendItem) {
  // Simulate a momentum curve based on velocity
  const base = Math.max(item.score * 0.3, 10)
  const peak = item.score
  const points = 8
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1)
    // Exponential growth curve toward the peak
    const value = base + (peak - base) * Math.pow(t, 1.5) + (Math.random() - 0.5) * base * 0.1
    return { i, value: Math.max(0, value) }
  })
}

export function Sparkline({ item, color }: Props) {
  const data = generateSparklineData(item)
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Tooltip
            contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '10px', color: '#f5f5f5' }}
            formatter={(v) => [typeof v === 'number' ? v.toLocaleString() : String(v), 'views']}
            labelFormatter={() => ''}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
