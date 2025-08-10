import { httpClient } from "@app/lib/axios"

type Question = {
  _id: string
  competency: string
  level: string
  questionText: string
  options: string[]
  timeLimit: number
  createdAt: string
  updatedAt: string
  __v: number
}

class TestServices {
  tests = [
    {
      level: 1,
      steps: ["A1", "A2"],
      name: "Level 1: A1 - A2",
      description: "Stage: Beginner",
      requiredLevel: 0,
      retakeAllowed: false,
    },
    {
      level: 2,
      steps: ["B1", "B2"],
      name: "Level 2: B1 - B2",
      description: "Stage: Intermediate",
      requiredLevel: 1,
      retakeAllowed: true,
    },
    {
      level: 3,
      steps: ["C1", "C2"],
      name: "Level 3: C1 - C2",
      description: "Stage: Upper-Intermediate",
      requiredLevel: 2,
      retakeAllowed: false,
    },
  ]

  async initiateTestSession(step: number | undefined) {
    const resp = await httpClient({
      url: "/tests/initiate-exam-session",
      method: "POST",
      payload: {
        step: step ?? 1,
      },
    })

    if (resp?.success) {
      return {
        isSuccess: true,
        message: resp.message,
        data: resp?.data,
      }
    }

    return {
      isSuccess: false,
      message: resp?.message,
      data: null,
    }
  }

  async getQuestions(level: string) {
    const resp = await httpClient<Question[]>({
      method: "GET",
      url: `/tests/questions/${level}/list`,
    })

    return resp?.data
  }
}

export const testServices = new TestServices()
