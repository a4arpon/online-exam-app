import { Toaster } from "@app/components/ui/sonner"
import { AuthProvider } from "@app/providers/AuthProvider"
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
      <Toaster position="top-center" />
    </AuthProvider>
  ),
})
