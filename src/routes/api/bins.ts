// routes/api/bins.ts
import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/db'
import { tBin } from '@/db/schema'

export const Route = createFileRoute('/api/bins')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const bins = await db.select().from(tBin)
          
          return new Response(JSON.stringify(bins), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Configure CORS as needed
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