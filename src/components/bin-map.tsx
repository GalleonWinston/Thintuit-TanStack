import { useRef, useState, useEffect } from 'react'
import { BinIcon } from '@/components/bin-icon'
import { BinDetail } from '@/components/bin-detail'

interface Bin {
  id: number
  locationX: number
  locationY: number
  status: number
  [key: string]: any
}

interface BinMapProps {
  bins: Bin[]
  onStatusChange: (id: number, newStatus: number) => void
}

export function BinMap({ bins, onStatusChange }: BinMapProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 })
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)

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
    onStatusChange(id, newStatus)
    setSelectedBin((prev) => (prev ? { ...prev, status: newStatus } : null))
  }

  const cellW = imgSize.width / 100
  const cellH = imgSize.height / 95
  const iconSize = Math.max(32, cellW * 1.8)

  return (
    <>
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

        {bins.map((bin) => (
          <div
            key={bin.id}
            className="absolute flex items-center justify-center cursor-pointer select-none"
            style={{
              left: bin.locationX * cellW,
              top: bin.locationY * cellH,
              transform: 'translate(-50%, -50%)',
              visibility: imgSize.width > 0 ? 'visible' : 'hidden',
            }}
            onClick={() => setSelectedBin(bin)}
          >
            <BinIcon status={bin.status} category={bin.category} size={iconSize} />
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
    </>
  )
}
