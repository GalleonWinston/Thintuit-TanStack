import { useState } from 'react'
import type { Bin, Filters } from './bin-table-types'
import { DEFAULT_FILTERS, CATEGORY_META, isWithinPreset } from './bin-table-types'
import { StatusCell } from './bin-table-status-cell'
import { BinTableFilterPanel } from './bin-table-filter-panel'

interface BinTableProps {
  bins: Bin[]
  onStatusChange: (id: number, newStatus: number) => void
  filter?: number | 'all'
  onFilterChange?: (filter: number | 'all') => void
}

export function BinTable({ bins, onStatusChange, filter, onFilterChange }: BinTableProps) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    if (key === 'status') onFilterChange?.(value as number | 'all')
  }

  const reset = () => {
    setFilters(DEFAULT_FILTERS)
    onFilterChange?.('all')
  }

  const effectiveFilters = { ...filters, status: filter ?? filters.status }

  const filtered = bins
    .filter((b) => effectiveFilters.status === 'all' || b.status === effectiveFilters.status)
    .filter((b) => effectiveFilters.category === 'all' || b.category === effectiveFilters.category)
    .filter((b) => isWithinPreset(b.lastServiceTime, effectiveFilters.serviced))
    .filter((b) => isWithinPreset(b.lastFullTime, effectiveFilters.full))
    .filter((b) => isWithinPreset(b.lastDisconnectedTime, effectiveFilters.disconnected))
    .filter((b) => effectiveFilters.active === 'all' || (effectiveFilters.active === 'active' ? b.active : !b.active))

  return (
    <div className="w-full space-y-4">
      <BinTableFilterPanel
        bins={bins}
        filters={effectiveFilters}
        filteredCount={filtered.length}
        showFilters={showFilters}
        onToggle={() => setShowFilters((v) => !v)}
        onSet={set}
        onReset={reset}
      />

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
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_META[bin.category]?.badge ?? 'bg-gray-100 text-gray-500'}`}>
                    {CATEGORY_META[bin.category]?.label ?? bin.category}
                  </span>
                </td>
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
