import { useMyCurrentSession } from "@app/hooks/useMyProfile"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/u/tests/$level/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { mySession } = useMyCurrentSession()

  return (
    <>
      <div className="bg-card p-4 rounded-lg flex flex-row justify-between items-center">
        <p className="text-2xl">Lavel 1 - Step {mySession?.levels}</p>
        <p>Total Time</p>
      </div>

      <div></div>
    </>
  )
}
