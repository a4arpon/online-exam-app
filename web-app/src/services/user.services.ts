import { httpClient } from "@app/lib/axios"

type CurrentExamSession = {
  _id: string
  user: string
  step: 1
  levels: string[]
  startedAt: string
  status: string
  retakeAllowed: boolean
  answers: []
  createdAt: string
  updatedAt: string
  __v: 0
}

class UserServices {
  async myCurrentProgress() {
    const resp = await httpClient<{
      currentLevel: string | null
      currentStep: number
    }>({
      method: "GET",
      url: "/user/my-progress",
    })

    return resp?.data
  }

  async myCurrentSession() {
    const resp = await httpClient<CurrentExamSession>({
      method: "GET",
      url: "/user/user/current-session",
    })

    return resp?.data
  }
}

export const userServices = new UserServices()
