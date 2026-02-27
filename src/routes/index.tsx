import { db } from '@/db'
import { tBin } from '@/db/schema'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useRef, useState, useEffect } from 'react'
import { Trash, BatteryLow, CircleHelp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const getBins = createServerFn({ method: 'GET' }).handler(() => {
  return db.select().from(tBin)
})

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const data = await getBins()
    return data
  },
})

function BinIcon({ status, size }: { status: number; size: number }) {
  switch (status) {
    case 1:
      return <Trash size={size} color="grey" />
    case 2:
      return <Trash size={size} color="green" />
    case 3:
      return <Trash size={size} color="red" />
    case 4:
      return <BatteryLow size={size} color="red" />
    default:
      return <CircleHelp size={size} color="blue" />
  }
}

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

function BinDetail({
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
  await fetch('/api/bin/updateStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bin.id, status: newStatus }),
  })
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

function App() {
  const data = Route.useLoaderData()
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 })
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [selectedBin, setSelectedBin] = useState<any>(null)
  const [bins, setBins] = useState<any[]>(data)

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImgSize({
          width: imgRef.current.clientWidth,
          height: imgRef.current.clientHeight,
        })
      }
    }

    const observer = new ResizeObserver(updateSize)
    if (imgRef.current) observer.observe(imgRef.current)
    window.addEventListener('scroll', updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateSize)
    }
  }, [])

  const handleImgLoad = () => {
    if (imgRef.current) {
      setNaturalSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      })
      setImgSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      })
    }
  }

  const handleStatusChange = (id: number, newStatus: number) => {
    setBins((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
    setSelectedBin((prev: any) =>
      prev ? { ...prev, status: newStatus } : null
    )
  }

  const cellW = imgSize.width / 100
  const cellH = imgSize.height / 95
  const iconSize = Math.max(32, cellW * 1.8)

  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      <div className="relative inline-block">
        <img
          ref={imgRef}
          src="/Thintuit.png"
          alt="Thintuit Logo"
          onLoad={handleImgLoad}
          className="block w-full h-auto"
          style={{
            maxWidth: naturalSize.width || '100%',
            maxHeight: naturalSize.height || '100vh',
            minWidth: 100,
            minHeight: 100,
          }}
        />

        {imgSize.width > 0 &&
          bins.map((bin: any) => (
            <div
              key={bin.id}
              className="absolute flex items-center justify-center cursor-pointer select-none"
              style={{
                left: bin.locationX * cellW,
                top: bin.locationY * cellH,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setSelectedBin(bin)}
            >
              <BinIcon status={bin.status} size={iconSize} />
              <span className="absolute font-bold text-black z-10 leading-none pointer-events-none">
                {bin.id}
              </span>
            </div>
          ))}
      </div>

      {selectedBin && (
        <BinDetail
          bin={selectedBin}
          onClose={() => setSelectedBin(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}