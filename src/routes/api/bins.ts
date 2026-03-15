// routes/api/bins.ts
import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/db'
import { tBin } from '@/db/schema'
import { checkApiKey } from '@/server/api-auth'

export const Route = createFileRoute('/api/bins')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = checkApiKey(request)
        if (unauthorized) return unauthorized

        try {
          const bins = await db.select().from(tBin)

          return new Response(JSON.stringify(bins), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          })
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Failed to fetch bins' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})