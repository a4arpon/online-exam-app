import { useAuth } from "@app/providers/AuthProvider"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/u")({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthorized } = useAuth()
  const navigator = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: true
  useEffect(() => {
    if (!isAuthorized) {
      navigator({ to: "/auth", replace: true })
    }

    return () => {}
  }, [isAuthorized])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Outlet />
    </div>
  )
}
