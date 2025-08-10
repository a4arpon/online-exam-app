import { httpClient } from "@app/lib/axios"
import { type Static, Type } from "@sinclair/typebox"

class AuthServices {
  public async register(payload: Static<typeof authValidations.register>) {
    const resp = await httpClient<null>({
      method: "POST",
      url: "/authentication/register",
      payload: payload,
    })

    if (resp?.success) {
      return {
        isSuccess: true,
        message: resp?.message,
      }
    }

    return {
      isSuccess: false,
      message: "Something went wrong",
    }
  }

  public async verifyWelcomeOtp(
    payload: Static<typeof authValidations.verifyWelcomeOtp>,
  ) {
    const resp = await httpClient<null>({
      method: "POST",
      url: "/authentication/verify-otp",
      payload: payload,
    })

    if (resp?.success) {
      return {
        isSuccess: true,
        message: resp?.message,
      }
    }

    return {
      isSuccess: false,
      message: resp?.message,
    }
  }

  public async login(payload: Static<typeof authValidations.login>) {
    const resp = await httpClient<null>({
      method: "POST",
      url: "/authentication/login",
      payload: payload,
    })

    if (resp?.success) {
      return {
        isSuccess: true,
        message: resp?.message,
      }
    }

    return {
      isSuccess: false,
      message: resp?.message,
    }
  }

  public async requestResendRegisterOTP(email: string) {
    const resp = await httpClient<null>({
      method: "PATCH",
      url: `/authentication/register-otp-refresh/${email}`,
    })

    if (resp?.success) {
      return {
        isSuccess: true,
        message: resp?.message,
      }
    }

    return {
      isSuccess: false,
      message: resp?.message,
    }
  }
}

export const authServices = new AuthServices()

export const authValidations = {
  login: Type.Object({
    email: Type.String(),
    password: Type.String({
      minLength: 6,
    }),
  }),

  register: Type.Object({
    name: Type.String(),
    email: Type.String({
      minLength: 6,
    }),
    password: Type.String({
      minLength: 6,
    }),
  }),

  verifyWelcomeOtp: Type.Object({
    email: Type.String({
      minLength: 6,
    }),
    OTP: Type.Number(),
  }),
}
