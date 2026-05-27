import { TrendItem } from '../types/trend'
import { getVelocityInfo } from '../lib/scoring'

interface Props {
  velocity: number
  source: TrendItem['source']
}

export function VelocityBadge({ velocity, source }: Props) {
  const info = getVelocityInfo(velocity, source)
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-sm border"
      style={{ color: info.color, borderColor: info.color + '44', backgroundColor: info.color + '11' }}
    >
      <span>{info.icon}</span>
      {info.label}
    </span>
  )
}
