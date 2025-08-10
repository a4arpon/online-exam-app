import { useAuth } from "@app/providers/AuthProvider"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthorized } = useAuth()
  const navigator = useNavigate()

  if (isAuthorized) {
    navigator({ to: "/u", replace: true })
  }

  return <Outlet />
}
