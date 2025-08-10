import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/tests")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto py-6">
      <Outlet />
    </div>
  )
}
