import { Trash2, CircleHelp, Flame, Recycle, House } from 'lucide-react'

const STATUS_COLOR: Record<number, string> = {
  1: 'grey',
  2: 'green',
  3: 'red',
  4: 'orange',
}

const CATEGORY_ICON: Record<number, React.ElementType> = {
  0: CircleHelp,
  1: Flame,
  2: Recycle,
  3: House,
  4: Trash2,
}

export function BinIcon({ status, category = 4, size }: { status: number; category?: number; size: number }) {
  const color = status === 4 ? 'orange' : STATUS_COLOR[status] ?? 'blue'
  const Icon = CATEGORY_ICON[category] ?? Trash2
  return <Icon size={size} color={color} />
}
