import { Button } from "@app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/tests/")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigator = useNavigate()

  return (
    <div className="grid grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Level 1: A1 - A2</CardTitle>
          <CardDescription>Stage: Beginner</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Retake Allowed: No</p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={() =>
              navigator({
                to: "/tests/$level",
                params: {
                  level: "1",
                },
              })
            }
          >
            Start Test Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
