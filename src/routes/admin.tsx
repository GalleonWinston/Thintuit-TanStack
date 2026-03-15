import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Map, Table2, Wifi, Trash2, AlertTriangle, Battery } from 'lucide-react'
import { verifyAdminSession } from '@/server/admin'
import { getBins, updateBinStatus } from '@/server/bins'
import { BinMap } from '@/components/bin-map'
import { BinTable } from '@/components/bin-table'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    try {
      await verifyAdminSession()
    } catch {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    const data = await getBins()
    return data
  },
  component: App,
})

const STATUS_META = [
  { value: 2, label: 'Normal',       icon: Trash2,        bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon_color: 'text-green-500'  },
  { value: 3, label: 'Full',         icon: AlertTriangle, bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    icon_color: 'text-red-500'    },
  { value: 4, label: 'Low Battery',  icon: Battery,       bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon_color: 'text-yellow-500' },
  { value: 1, label: 'Disconnected', icon: Wifi,          bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200',   icon_color: 'text-gray-400'   },
]

const NAV = [
  { view: 'map'   as const, label: 'Map',   Icon: Map    },
  { view: 'table' as const, label: 'Table', Icon: Table2 },
]

function App() {
  const data = Route.useLoaderData()
  const [bins, setBins] = useState<any[]>(data)
  const [activeView, setActiveView] = useState<'map' | 'table'>('map')
  const [tableFilter, setTableFilter] = useState<number | 'all'>('all')
  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await getBins()
      setBins(fresh)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (id: number, newStatus: number) => {
    await updateBinStatus({ data: { id, status: newStatus } })
    const fresh = await getBins()
    setBins(fresh)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 bg-(--ink) flex-col">
        <div className="px-4 pt-6 pb-4 border-b border-white/10">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">Views</p>
        </div>

        <nav className="flex flex-col gap-1 px-3 pt-4">
          {NAV.map(({ view, label, Icon }) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:bg-white/8 hover:text-white/80'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Sidebar footer stats */}
        <div className="mt-auto px-4 py-5 border-t border-white/10">
          <p className="text-white/40 text-xs mb-3 font-semibold uppercase tracking-widest">Total Bins</p>
          <p className="text-white text-3xl font-bold">{bins.length}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-16 md:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            {activeView === 'map' ? 'Map View' : 'Table View'}
          </h1>
          <span className="text-sm text-gray-400">{bins.length} bins total</span>
        </div>

        {/* Status stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 md:px-6 py-4 md:py-5">
          {STATUS_META.map(({ value, label, icon: Icon, bg, text, border, icon_color }) => {
            const count = bins.filter((b) => b.status === value).length
            return (
              <button
                key={value}
                type="button"
                onClick={() => { setActiveView('table'); setTableFilter(value) }}
                className={`rounded-xl border ${border} ${bg} px-3 py-3 md:px-4 md:py-4 flex items-center gap-3 md:gap-4 text-left transition-shadow hover:shadow-md cursor-pointer`}
              >
                <div className={icon_color}>
                  <Icon size={28} className="md:hidden" />
                  <Icon size={36} className="hidden md:block" />
                </div>
                <div>
                  <p className={`text-3xl md:text-4xl font-extrabold ${text}`}>{count}</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-500 mt-0.5 md:mt-1">{label}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* View content */}
        <div className="px-4 md:px-6 pb-10">
          {activeView === 'table' ? (
            <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 overflow-x-auto">
              <BinTable bins={bins} onStatusChange={handleStatusChange} filter={tableFilter} onFilterChange={setTableFilter} />
            </div>
          ) : (
            <div className="flex justify-center">
              <BinMap bins={bins} onStatusChange={handleStatusChange} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-(--ink) flex border-t border-white/10">
        {NAV.map(({ view, label, Icon }) => (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              activeView === view ? 'text-white' : 'text-white/45'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
