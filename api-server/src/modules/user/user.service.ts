import { BadRequestException, Injectable } from "@nestjs/common"
import { QuestionLevelType } from "~/interfaces/question.interface"
import { response } from "~/libs/response"
import { ExamSessionModel } from "~/schemas/exam-session.schema"

@Injectable()
export class UserService {
  async getUserProgress(userId: string) {
    const [lastPassed, activeSession] = await Promise.all([
      ExamSessionModel.findOne({
        user: userId,
        status: "passed",
      }).sort({ step: -1 }),
      ExamSessionModel.findOne({
        user: userId,
        status: "in-progress",
      }),
    ])

    if (activeSession) {
      return response({
        message: "Existing in-progress session found",
        data: {
          currentLevel: this.getHighestLevelFromStep(activeSession.step - 1),
          currentStep: activeSession.step,
        },
      })
    }

    const currentLevel = lastPassed
      ? this.getHighestLevelFromStep(lastPassed.step)
      : null

    const currentStep = lastPassed ? lastPassed.step + 1 : 1

    return response({
      message: "No active exam session found",
      data: {
        currentLevel,
        currentStep,
      },
    })
  }

  private getHighestLevelFromStep(step: number): QuestionLevelType {
    switch (step) {
      case 1:
        return "A2"
      case 2:
        return "B2"
      case 3:
        return "C2"
      default:
        throw new Error("Invalid step")
    }
  }

  async getCurrentSession(user: string) {
    const session = await ExamSessionModel.findOne({
      user: user,
      status: "in-progress",
    })

    if (!session) {
      throw new BadRequestException("No active exam session found")
    }

    return response({
      message: "Current session found",
      data: session,
    })
  }
}
