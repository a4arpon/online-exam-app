import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/tests/$level/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tests/$testId/"!</div>
}
