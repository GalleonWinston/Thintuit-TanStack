import { db } from '@/db'
import { tBin } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'

export const getBins = createServerFn({ method: 'GET' }).handler(() => {
  return db.select().from(tBin)
})

export const updateBinStatus = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number; status: number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(
      `https://thintuit.cn/Controllers/BinWS.asmx/UpdateStatus?id=${data.id}&newBinStatus=${data.status}`,
    )
    if (!response.ok) throw new Error(`External API failed: ${response.status}`)
    return { success: true }
  })
