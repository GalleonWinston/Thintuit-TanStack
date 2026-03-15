import { useState, useRef, useEffect } from 'react'
import { updateBinStatus } from '@/server/bins'
import type { Bin } from './bin-table-types'
import { STATUS_COLORS, STATUS_META, STATUSES } from './bin-table-types'

export function StatusCell({ bin, onStatusChange }: { bin: Bin; onStatusChange: (id: number, newStatus: number) => void }) {
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
    await updateBinStatus({ data: { id: bin.id, status: newStatus } })
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
        {loading ? '…' : (STATUS_META[bin.status]?.label ?? bin.status)}
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
