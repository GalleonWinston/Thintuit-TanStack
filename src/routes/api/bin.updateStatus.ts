import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/bin/updateStatus')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json()
          const { id, status } = body

          if (typeof id !== 'number' || typeof status !== 'number') {
            return new Response(
              JSON.stringify({ error: 'id and status must be numbers' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          if (![1, 2, 3, 4].includes(status)) {
            return new Response(
              JSON.stringify({ error: 'invalid status value' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          const response = await fetch(
            `https://thintuit.cn/Controllers/BinWS.asmx/UpdateStatus?id=${id}&newBinStatus=${status}`,
          )
          if (!response.ok)
            throw new Error(`External API failed: ${response.status}`)

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to update bin status' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
