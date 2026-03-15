# Chimicada

Smart waste bin monitoring dashboard for XJTLU. Track bin status in real-time, manage work orders, and keep your environment clean.

## Overview

Chimicada is a full-stack web application that connects to a network of smart waste bins. It provides:

- **Interactive map** — visualize all bins on a floor plan with live status indicators
- **Data table** — browse, filter, and manage all bins in a tabular view
- **Status management** — change bin status directly from the dashboard or via API
- **Auto-refresh** — bin data automatically refreshes every 5 seconds
- **Admin dashboard** — protected admin area with stats cards and bin management

### Bin Statuses

| Status | Description |
|--------|-------------|
| Normal | Bin is operational and not full |
| Full | Bin needs to be emptied |
| Low Battery | Bin sensor battery is low |
| Disconnected | Bin is not communicating |

## Tech Stack

- **[TanStack Start](https://tanstack.com/start)** — full-stack React framework with SSR
- **[TanStack Router](https://tanstack.com/router)** — file-based routing
- **[Drizzle ORM](https://orm.drizzle.team/)** — type-safe MySQL queries
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** — UI component library
- **[Lucide React](https://lucide.dev/)** — icons

## Getting Started

### Prerequisites

- Node.js 22+
- MySQL database

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
node .output/server/index.mjs
```

### Docker

```bash
docker build -t chimicada .
docker run -p 3000:3000 chimicada
```

## Project Structure

```
src/
├── components/
│   ├── bin-map.tsx        # Interactive floor plan with bin overlays
│   ├── bin-table.tsx      # Filterable bin data table
│   ├── bin-detail.tsx     # Bin detail dialog with status controls
│   ├── bin-icon.tsx       # Status-colored bin icon
│   └── header.tsx         # Top navigation bar
├── routes/
│   ├── __root.tsx         # Root layout
│   ├── index.tsx          # Landing page
│   ├── login.tsx          # Admin login
│   ├── admin.tsx          # Admin dashboard
│   └── api/
│       ├── bins.ts        # GET /api/bins
│       └── bin.updateStatus.ts  # POST /api/bin/updateStatus
├── server/
│   ├── admin.ts           # Admin session functions
│   └── bins.ts            # Bin data server functions
└── db/
    ├── index.ts           # Database connection
    └── schema.ts          # Drizzle schema
```

## API

### GET /api/bins
Returns all bins.

### POST /api/bin/updateStatus
Updates a bin's status.

**Request body:**
```json
{ "id": 1, "status": 2 }
```

**Status values:** `1` = Disconnected, `2` = Normal, `3` = Full, `4` = Low Battery

Requires `x-api-key` header for authentication.

## License

XJTLU Project
