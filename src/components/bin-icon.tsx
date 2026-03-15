import { Trash, BatteryLow, CircleHelp } from 'lucide-react'

export function BinIcon({ status, size }: { status: number; size: number }) {
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
