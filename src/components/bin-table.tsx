import { useState, useRef, useEffect } from 'react'

const STATUS_LABELS: Record<number, string> = {
  1: 'Disconnected',
  2: 'Normal',
  3: 'Full',
  4: 'Low Battery',
}

const STATUS_COLORS: Record<number, string> = {
  1: 'text-gray-400',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-yellow-600',
}

const FILTER_STYLES: Record<number | 'all', string> = {
  all: 'bg-gray-100 text-gray-700',
  1: 'bg-gray-200 text-gray-500',
  2: 'bg-green-100 text-green-700',
  3: 'bg-red-100 text-red-700',
  4: 'bg-yellow-100 text-yellow-700',
}

const STATUSES = [
  { value: 1, label: 'Disconnected' },
  { value: 2, label: 'Normal' },
  { value: 3, label: 'Full' },
  { value: 4, label: 'Low Battery' },
]

interface Bin {
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

interface BinTableProps {
  bins: Bin[]
  onStatusChange: (id: number, newStatus: number) => void
  filter?: number | 'all'
  onFilterChange?: (filter: number | 'all') => void
}

function StatusCell({ bin, onStatusChange }: { bin: Bin; onStatusChange: (id: number, newStatus: number) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = async (newStatus: number) => {
    if (newStatus === bin.status) { setOpen(false); return }
    setLoading(true)
    await fetch('/api/bin/updateStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bin.id, status: newStatus }),
    })
    onStatusChange(bin.id, newStatus)
    setLoading(false)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen((v) => !v)}
        className={`font-medium underline decoration-dotted underline-offset-2 cursor-pointer transition-opacity disabled:opacity-50 ${STATUS_COLORS[bin.status] ?? 'text-gray-600'}`}
      >
        {loading ? '…' : (STATUS_LABELS[bin.status] ?? bin.status)}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-md shadow-md py-1 min-w-32">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => handleSelect(s.value)}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 ${s.value === bin.status ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function BinTable({ bins, onStatusChange, filter, onFilterChange }: BinTableProps) {
  const [localFilter, setLocalFilter] = useState<number | 'all'>('all')

  const activeFilter = filter ?? localFilter
  const setActiveFilter = (f: number | 'all') => {
    setLocalFilter(f)
    onFilterChange?.(f)
  }

  const filtered = activeFilter === 'all' ? bins : bins.filter((b) => b.status === activeFilter)

  return (
    <div className="w-full">
      {/* Filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 2, 3, 4, 1] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeFilter === status
                ? `${FILTER_STYLES[status]} border-transparent`
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {status === 'all' ? 'All' : STATUS_LABELS[status]}
            <span className="ml-1.5 opacity-60">
              {status === 'all' ? bins.length : bins.filter((b) => b.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Location X</th>
              <th className="px-4 py-3">Location Y</th>
              <th className="px-4 py-3">Last Serviced</th>
              <th className="px-4 py-3">Last Full</th>
              <th className="px-4 py-3">Last Disconnected</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bin) => (
              <tr key={bin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{bin.id}</td>
                <td className="px-4 py-3">
                  <StatusCell bin={bin} onStatusChange={onStatusChange} />
                </td>
                <td className="px-4 py-3 text-gray-600">{bin.category}</td>
                <td className="px-4 py-3 text-gray-600">{bin.description ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{bin.locationX}</td>
                <td className="px-4 py-3 text-gray-600">{bin.locationY}</td>
                <td className="px-4 py-3 text-gray-600">{bin.lastServiceTime}</td>
                <td className="px-4 py-3 text-gray-600">{bin.lastFullTime}</td>
                <td className="px-4 py-3 text-gray-600">{bin.lastDisconnectedTime}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${bin.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {bin.active ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
