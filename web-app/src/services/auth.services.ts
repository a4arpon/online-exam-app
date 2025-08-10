import { Type } from "@sinclair/typebox"

class AuthServices {
  public async login(callback: () => void) {
    if (callback) {
      callback()
    }

    return {
      isSuccess: true,
      message: "Nothing special",
      data: null,
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
    email: Type.String(),
    password: Type.String({
      minLength: 6,
    }),
  }),
}
