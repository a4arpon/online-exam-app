import { cardAnimations } from "@app/assets/framer-motions/card-animations"
import { Button } from "@app/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card"
import { Input } from "@app/components/ui/input"
import { Label } from "@app/components/ui/label"
import { isValidPayload } from "@app/lib/validator"
import { authServices, authValidations } from "@app/services/auth.services"
import type { Static } from "@sinclair/typebox"
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const Route = createLazyFileRoute("/auth/register")({
  component: RouteComponent,
})

function RouteComponent() {
  const { register, reset, handleSubmit } =
    useForm<Static<typeof authValidations.register>>()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const { isValidated, errorMessage } = isValidPayload(
      authValidations.register,
      data,
    )

    if (!isValidated) {
      toast.error(errorMessage)
      return
    }

    const { isSuccess, message } = await authServices.register(data)

    if (isSuccess) {
      toast.success(message)
      navigate({ to: "/auth/welcome", replace: true })
      return
    }

    toast.info(message)
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex justify-center items-center min-h-screen"
    >
      <motion.div {...cardAnimations.bouncyCards}>
        <Card className="lg:w-lg">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2.5">
              <Label>Name</Label>
              <Input
                placeholder="Enter Your Email"
                {...register("name")}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label>Email</Label>
              <Input
                placeholder="Enter Your Email"
                {...register("email")}
                type="email"
              />
            </div>
            <div>
              <p>
                Already have an account?{" "}
                <Link to="/auth" className="underline">
                  Login Now
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label>Password</Label>
              <Input
                placeholder="Enter Your Password"
                {...register("password")}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button>Register</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </form>
  )
}
