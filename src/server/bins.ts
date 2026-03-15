import { db } from '@/db'
import { tBin } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'

export const getBins = createServerFn({ method: 'GET' }).handler(() => {
  return db.select().from(tBin)
})
