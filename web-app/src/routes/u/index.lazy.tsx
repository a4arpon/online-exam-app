import { Button } from "@app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import {
  useMyCurrentProgress,
  useMyCurrentSession,
} from "@app/hooks/useMyProfile"
import { useAuth } from "@app/providers/AuthProvider"
import { testServices } from "@app/services/tests.services"
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { DownloadIcon } from "lucide-react"
import { toast } from "sonner"

export const Route = createLazyFileRoute("/u/")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigator = useNavigate()
  const { user } = useAuth()
  const { myProgress } = useMyCurrentProgress()
  const { mySession } = useMyCurrentSession()

  const initTestSession = async () => {
    if (!myProgress || !myProgress?.currentStep) {
      toast.error("No steps available for you at this time.")
    }

    const { isSuccess, message } = await testServices.initiateTestSession(
      myProgress?.currentStep,
    )

    if (isSuccess) {
      toast.success(message)
      navigator({
        to: "/u/tests/$level",
        params: {
          level: myProgress?.currentStep?.toString() ?? "1",
        },
      })
      return
    }

    toast.error(message)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome {user?.name ?? "User"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Card className="border">
              <CardHeader>
                <CardTitle>{user?.currentLevel}</CardTitle>
                <CardDescription className="text-lg">
                  Current Level
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border">
              <CardHeader>
                <CardTitle>
                  {mySession ? mySession?.levels?.join(", ") : "None"}
                </CardTitle>
                <CardDescription className="text-lg">
                  Current Session
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border">
              <CardHeader>
                <CardTitle>None</CardTitle>
                <CardDescription>
                  <Link
                    to="/"
                    className="text-lg flex flex-row gap-1.5 items-center"
                  >
                    <span>Certificates</span>
                    <DownloadIcon size={16} />
                  </Link>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {testServices?.tests?.map((test) => (
          <Card key={test?.name}>
            <CardHeader>
              <CardTitle>{test?.name}</CardTitle>
              <CardDescription>{test?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Retake Allowed: {test?.retakeAllowed ? "Yes" : "No"}</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={() => initTestSession()}
                disabled={
                  test?.requiredLevel > (myProgress?.currentStep ?? 1) - 1
                }
              >
                Start Test Session
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
