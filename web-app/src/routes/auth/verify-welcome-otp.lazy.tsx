import { Button } from "@app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import { Input } from "@app/components/ui/input"
import { isValidPayload } from "@app/lib/validator"
import { authServices, authValidations } from "@app/services/auth.services"
import type { Static } from "@sinclair/typebox"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const Route = createLazyFileRoute("/auth/verify-welcome-otp")({
  component: RouteComponent,
})

function RouteComponent() {
  const { register, handleSubmit, getValues } =
    useForm<Static<typeof authValidations.verifyWelcomeOtp>>()
  const [isInvalidOTP, setIsInvalidOTP] = useState(false)

  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const { isValidated, errorMessage } = isValidPayload(
      authValidations.verifyWelcomeOtp,
      data,
    )

    if (!isValidated) {
      toast.error(errorMessage)
      return
    }

    const { isSuccess, message } = await authServices.verifyWelcomeOtp(data)

    if (isSuccess) {
      toast.success(message)
      navigate({ to: "/auth", replace: true })
      return
    }

    console.log(message)

    if (message === "OTP not found or might be expired") {
      setIsInvalidOTP(true)
    }
  })

  return (
    <form
      className="flex h-screen items-center justify-center"
      onSubmit={onSubmit}
    >
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>
            Enter your email and the 6-digit OTP sent to your inbox.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3.5">
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />

          <Input
            type="text"
            placeholder="Enter your OTP"
            {...register("OTP", {
              setValueAs: (val) => Number.parseInt(val),
            })}
          />
        </CardContent>

        <CardFooter className="justify-center">
          <Button>Submit</Button>
        </CardFooter>
        {isInvalidOTP && (
          <CardFooter className="flex-col items-start gap-3.5">
            <p>OTP Might be expired. Resend Again.</p>
            <Button
              onClick={async () => {
                if (!getValues("email") || getValues("email").length < 6) {
                  toast.error("Invalid email")
                  return
                }

                await authServices.requestResendRegisterOTP(getValues("email"))

                setIsInvalidOTP(false)
              }}
              type="button"
            >
              Resend Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  )
}
