import { Navbar } from "@app/components/shared/Navbar"
import { Button } from "@app/components/ui/button"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-5">
        <div className="space-y-5 rounded py-20">
          <h2 className="text-7xl">Test Your English Skills</h2>
          <h3 className="text-6xl">Grab Your Free Certificate</h3>
          <h3 className="text-4xl leading-relaxed">
            Organized by ~ <br />
            Hunan Govt. High School English Club
          </h3>
          <Button>Begin Your Test</Button>
        </div>
        <hr />
      </div>
    </>
  )
}
