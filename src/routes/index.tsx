import { createFileRoute } from '@tanstack/react-router'
import { Wifi, ClipboardList, Bell, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const features = [
  {
    icon: Wifi,
    title: 'Real-Time Monitoring',
    description: 'Smart bins send live status updates to the cloud, giving you instant visibility across all locations.',
    iconClass: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Trash2,
    title: 'Bin Status Tracking',
    description: 'Track each bin — normal, full, disconnected, or low battery — displayed on an interactive map.',
    iconClass: 'text-green-600 bg-green-50',
  },
  {
    icon: ClipboardList,
    title: 'Automatic Work Orders',
    description: 'Maintenance work orders are automatically generated and dispatched when bins require attention.',
    iconClass: 'text-purple-500 bg-purple-50',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Workers receive notifications via WeChat mini-program so issues are resolved without delay.',
    iconClass: 'text-orange-500 bg-orange-50',
  },
]

function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28 gap-6"
        style={{ background: 'linear-gradient(160deg, var(--foam) 0%, var(--bg-base) 100%)' }}
      >
        <div className="flex flex-row items-center gap-5">
          <img src="/cicada_logo.png" alt="Chimcada logo" className="w-32 h-32 object-contain drop-shadow-sm" />
          <h1 className="text-6xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
            Chimicada Project
          </h1>
        </div>

        <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
          Smart waste bin monitoring. Track bin status, automate work orders, and keep your environment clean.
        </p>

        <div className="flex gap-3 text-sm text-muted-foreground mt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Full
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Disconnected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Low Battery
          </span>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 py-16 border-t" style={{ backgroundColor: 'var(--sand)' }}>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10">
          What it does
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description, iconClass }) => (
            <div key={title} className="flex gap-4 bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
              <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-5 text-center text-sm text-muted-foreground" style={{ backgroundColor: 'var(--foam)' }}>
        Chimicada Project &mdash; XJTLU
      </footer>
    </div>
  )
}
