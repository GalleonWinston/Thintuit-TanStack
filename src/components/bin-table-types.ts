import { Flame, Recycle, House, Trash2, CircleHelp } from 'lucide-react'

export type DatePreset = 'all' | 'today' | 'week' | 'month'
export type ActiveFilter = 'all' | 'active' | 'inactive'

export interface Filters {
  status: number | 'all'
  category: number | 'all'
  serviced: DatePreset
  full: DatePreset
  disconnected: DatePreset
  active: ActiveFilter
}

export interface Bin {
  id: number
  locationX: number
  locationY: number
  status: number
  lastServiceTime: string
  lastFullTime: string
  category: number
  description?: string | null
  lastDisconnectedTime: string
  active: number
}

export const DEFAULT_FILTERS: Filters = {
  status: 'all',
  category: 'all',
  serviced: 'all',
  full: 'all',
  disconnected: 'all',
  active: 'all',
}

export function isWithinPreset(dateStr: string, preset: DatePreset): boolean {
  if (preset === 'all') return true
  const date = new Date(dateStr)
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (preset === 'today') return date >= startOfDay
  if (preset === 'week') {
    const startOfWeek = new Date(startOfDay)
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
    return date >= startOfWeek
  }
  if (preset === 'month') return date >= new Date(now.getFullYear(), now.getMonth(), 1)
  return true
}

export const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'all',   label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week',  label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

export const CATEGORY_META: Record<number, { label: string; badge: string; card: string; border: string; text: string; icon: React.ElementType }> = {
  0: { label: 'Not Set',    badge: 'bg-gray-100 text-gray-500',     card: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-600',   icon: CircleHelp },
  1: { label: 'Hazardous',  badge: 'bg-red-100 text-red-700',       card: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    icon: Flame      },
  2: { label: 'Recyclable', badge: 'bg-green-100 text-green-700',   card: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  icon: Recycle    },
  3: { label: 'Household',  badge: 'bg-blue-100 text-blue-700',     card: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   icon: House      },
  4: { label: 'Residual',   badge: 'bg-orange-100 text-orange-700', card: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: Trash2     },
}

export const STATUS_META: Record<number | 'all', { label: string; active: string }> = {
  all: { label: 'All',          active: 'bg-gray-100 text-gray-700'     },
  1:   { label: 'Disconnected', active: 'bg-gray-200 text-gray-500'     },
  2:   { label: 'Normal',       active: 'bg-green-100 text-green-700'   },
  3:   { label: 'Full',         active: 'bg-red-100 text-red-700'       },
  4:   { label: 'Low Battery',  active: 'bg-yellow-100 text-yellow-700' },
}

export const STATUS_COLORS: Record<number, string> = {
  1: 'text-gray-400',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-yellow-600',
}

export const STATUSES = [
  { value: 1, label: 'Disconnected' },
  { value: 2, label: 'Normal' },
  { value: 3, label: 'Full' },
  { value: 4, label: 'Low Battery' },
]
