import { LoginForm } from '@/components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
      <LoginForm className="w-full max-w-xl" />
    </div>
  )
}
