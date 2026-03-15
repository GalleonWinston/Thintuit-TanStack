import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { adminLogout } from '@/server/admin'

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await adminLogout()
    navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 px-[2vw] py-[1.5vh] bg-white text-(--ink)">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-[1vw] font-semibold text-(--ink)" style={{ fontSize: 'clamp(14px, 1.5vw, 22px)' }}>
          <img src="/cicada_logo.png" alt="Chimcada logo" style={{ width: 'clamp(40px, 5vw, 72px)', height: 'clamp(40px, 5vw, 72px)' }} />
          Chimicada
        </Link>

        {pathname === '/admin' ? (
          <Button variant="outline" size="sm" onClick={handleLogout} style={{ fontSize: 'clamp(12px, 1vw, 16px)', padding: 'clamp(4px, 0.5vw, 8px) clamp(8px, 1vw, 16px)' }}>
            Logout
          </Button>
        ) : pathname === '/' ? (
          <Button asChild size="sm" style={{ fontSize: 'clamp(12px, 1vw, 16px)', padding: 'clamp(4px, 0.5vw, 8px) clamp(8px, 1vw, 16px)' }}>
            <Link to="/login">Admin Login</Link>
          </Button>
        ) : null}
      </div>
    </header>
  )
}
