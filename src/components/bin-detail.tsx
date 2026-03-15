import { useState } from 'react'
import { updateBinStatus } from '@/server/bins'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BinIcon } from '@/components/bin-icon'

function StatusBadge({ status }: { status: number }) {
  const map: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    0: { label: 'Unknown', variant: 'outline' },
    1: { label: 'Disconnected', variant: 'secondary' },
    2: { label: 'Normal', variant: 'default' },
    3: { label: 'Full', variant: 'destructive' },
    4: { label: 'Low Battery', variant: 'outline' },
  }
  const s = map[status] ?? map[0]
  return <Badge variant={s.variant}>{s.label}</Badge>
}

function CategoryBadge({ category }: { category: number }) {
  const map: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    0: { label: 'Not Set', variant: 'outline' },
    1: { label: 'Hazardous', variant: 'destructive' },
    3: { label: 'Household', variant: 'secondary' },
    4: { label: 'Residual', variant: 'default' },
  }
  const c = map[category] ?? map[0]
  return <Badge variant={c.variant}>{c.label}</Badge>
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="font-medium text-right">{String(value)}</span>
    </div>
  )
}

export function BinDetail({
  bin,
  onClose,
  onStatusChange,
}: {
  bin: any
  onClose: () => void
  onStatusChange: (id: number, status: number) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: number) => {
    setLoading(true)
    await updateBinStatus({ data: { id: bin.id, status: newStatus } })
    onStatusChange(bin.id, newStatus)
    setLoading(false)
  }

  const statuses = [
    { value: 1, label: 'Disconnected' },
    { value: 2, label: 'Normal' },
    { value: 3, label: 'Full' },
    { value: 4, label: 'Low Battery' },
  ]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-lg [&>button]:h-8 [&>button]:w-8 [&>button]:top-4 [&>button]:right-4 [&>button>svg]:h-5 [&>button>svg]:w-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <BinIcon status={bin.status} size={40} />
            Bin #{bin.id}
          </DialogTitle>
          <DialogDescription className="sr-only">Bin details and status management</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={bin.status} />
          <CategoryBadge category={bin.category} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-400 text-sm shrink-0">Change status:</span>
          {statuses.map((s) => (
            <button
              key={s.value}
              disabled={loading || bin.status === s.value}
              onClick={() => handleStatusChange(s.value)}
              className="px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        <Separator />

        <div className="space-y-3 text-base text-gray-700">
          <Row label="Description" value={bin.description} />
          <Row label="Location" value={`X: ${bin.locationX}, Y: ${bin.locationY}`} />
          <Row label="Active" value={bin.active ? 'Yes' : 'No'} />
          <Row label="Last Serviced" value={bin.lastServiceTime} />
          <Row label="Last Full" value={bin.lastFullTime} />
          <Row label="Last Disconnected" value={bin.lastDisconnectedTime} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
