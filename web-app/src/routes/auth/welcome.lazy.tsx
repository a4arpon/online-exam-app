import { Button } from "@app/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import { createLazyFileRoute, Link } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/auth/welcome")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full lg:w-3xl p-6 text-center">
        <CardHeader>
          <CardTitle>Welcome User!</CardTitle>
          <CardDescription>
            Please verify your account to continue. Check your email for the
            verification OTP.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link to="/auth/verify-welcome-otp" replace>
            <Button>Verify Your Account</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
