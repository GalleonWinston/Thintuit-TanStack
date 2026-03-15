import { SlidersHorizontal, X } from 'lucide-react'
import type { Filters, Bin } from './bin-table-types'
import { DATE_PRESETS, CATEGORY_META, STATUS_META } from './bin-table-types'

function FilterPill({ active, activeClass, onClick, children }: {
  active: boolean
  activeClass: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
        active ? `${activeClass} border-transparent` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

interface FilterPanelProps {
  bins: Bin[]
  filters: Filters
  filteredCount: number
  showFilters: boolean
  onToggle: () => void
  onSet: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  onReset: () => void
}

export function BinTableFilterPanel({ bins, filters, filteredCount, showFilters, onToggle, onSet, onReset }: FilterPanelProps) {
  const activeCount = Object.entries(filters).filter(([, v]) => v !== 'all').length

  return (
    <>
      {/* Category cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {([1, 2, 3, 4, 0] as const).map((cat) => {
          const { label, card, border, text, icon: Icon } = CATEGORY_META[cat]
          const count = bins.filter((b) => b.category === cat).length
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSet('category', filters.category === cat ? 'all' : cat)}
              className={`rounded-xl border ${border} ${card} px-3 py-3 flex items-center gap-3 text-left transition-shadow hover:shadow-md ${filters.category === cat ? 'ring-2 ring-offset-1 ring-current' : ''} ${text}`}
            >
              <Icon size={24} />
              <div>
                <p className="text-2xl font-extrabold">{count}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filter toggle bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            activeCount > 0
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <X size={12} />
            Clear all
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400">{filteredCount} of {bins.length} bins</span>
      </div>

      {/* Unified filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 w-36 shrink-0">Status</span>
            {(['all', 2, 3, 4, 1] as const).map((s) => (
              <FilterPill
                key={s}
                active={filters.status === s}
                activeClass={STATUS_META[s].active}
                onClick={() => onSet('status', s)}
              >
                {STATUS_META[s].label}
                <span className="ml-1.5 opacity-60">
                  {s === 'all' ? bins.length : bins.filter((b) => b.status === s).length}
                </span>
              </FilterPill>
            ))}
          </div>

          {/* Category */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 w-36 shrink-0">Category</span>
            <FilterPill
              active={filters.category === 'all'}
              activeClass="bg-gray-100 text-gray-700"
              onClick={() => onSet('category', 'all')}
            >
              All <span className="ml-1.5 opacity-60">{bins.length}</span>
            </FilterPill>
            {([1, 2, 3, 4, 0] as const).map((cat) => (
              <FilterPill
                key={cat}
                active={filters.category === cat}
                activeClass={CATEGORY_META[cat].badge}
                onClick={() => onSet('category', cat)}
              >
                {CATEGORY_META[cat].label}
                <span className="ml-1.5 opacity-60">{bins.filter((b) => b.category === cat).length}</span>
              </FilterPill>
            ))}
          </div>

          <div className="border-t border-gray-100" />

          {/* Date filters */}
          {([
            { label: 'Last Serviced',     key: 'serviced'     as const },
            { label: 'Last Full',         key: 'full'         as const },
            { label: 'Last Disconnected', key: 'disconnected' as const },
          ]).map(({ label, key }) => (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 w-36 shrink-0">{label}</span>
              {DATE_PRESETS.map((p) => (
                <FilterPill
                  key={p.value}
                  active={filters[key] === p.value}
                  activeClass="bg-indigo-100 text-indigo-700"
                  onClick={() => onSet(key, p.value)}
                >
                  {p.label}
                </FilterPill>
              ))}
            </div>
          ))}

          {/* Active */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 w-36 shrink-0">Active</span>
            {(['all', 'active', 'inactive'] as const).map((v) => (
              <FilterPill
                key={v}
                active={filters.active === v}
                activeClass={
                  v === 'active'   ? 'bg-green-100 text-green-700' :
                  v === 'inactive' ? 'bg-gray-100 text-gray-500'   :
                                     'bg-indigo-100 text-indigo-700'
                }
                onClick={() => onSet('active', v)}
              >
                {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
              </FilterPill>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
