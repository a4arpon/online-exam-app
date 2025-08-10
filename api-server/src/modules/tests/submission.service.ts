import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { Types } from "mongoose"
import { AnswerStatus } from "~/interfaces/exam.interface"
import { QuestionLevelType } from "~/interfaces/question.interface"
import { response } from "~/libs/response"
import { ExamSessionModel } from "~/schemas/exam-session.schema"
import { TestQuestionModel } from "~/schemas/questions.schema"
import { UserModel } from "~/schemas/user.schema"
import { SubmitAnswersDto } from "./tests.dto"

@Injectable()
export class SubmissionService {
  getLevelsByStep(step: number): QuestionLevelType[] {
    switch (step) {
      case 1:
        return ["A1", "A2"]
      case 2:
        return ["B1", "B2"]
      case 3:
        return ["C1", "C2"]
      default:
        throw new Error("Invalid step")
    }
  }

  async submitAnswers(userId: string, { answers }: SubmitAnswersDto) {
    /**
     * |---------------------------------------------------------
     * | Check if user has an active exam session
     * |---------------------------------------------------------
     */
    const session = await ExamSessionModel.findOne({
      user: userId,
      status: "in-progress",
    })
    if (!session) throw new NotFoundException("No active exam session found")

    const questionIds = answers.map((a) => a.question)
    const questions = await TestQuestionModel.find({
      _id: { $in: questionIds },
    })

    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]))

    const duplicateQuestion = answers.find(({ question }) =>
      session.answers.some((a) => a?.question?.toString() === question),
    )

    if (duplicateQuestion) {
      throw new BadRequestException(
        `Duplicate answer submission found for question ${duplicateQuestion.question}`,
      )
    }

    /**
     * |---------------------------------------------------------
     * | Process answers
     *
     * | 1. Check if answer is valid
     * | 2. Check if answer is correct
     * | 3. Check if answer is timed out
     * | 4. Update session
     * | 5. Update user's current level
     * | 6. Update user's score
     *
     * |---------------------------------------------------------
     */

    const processedAnswers = answers?.map(
      ({ question, selectedOption, questionStartedAt, answeredAt }) => {
        const q = questionMap.get(question as string)
        if (!q) throw new BadRequestException(`Question ${question} not found`)

        const timeDiffSeconds =
          (new Date(answeredAt).getTime() -
            new Date(questionStartedAt).getTime()) /
          1000

        const status =
          timeDiffSeconds > q.timeLimit
            ? AnswerStatus.TIMEOUT
            : AnswerStatus.VALID

        const isCorrect =
          status === AnswerStatus.VALID && q.correctAnswer === selectedOption

        return {
          question: q._id as Types.ObjectId,
          selectedOption,
          questionStartedAt: new Date(questionStartedAt),
          answeredAt: new Date(answeredAt),
          status,
          isCorrect,
        }
      },
    )

    session.answers.push(...processedAnswers)

    const validCorrectCount = session.answers.filter(
      (a) => a.status === "valid" && a.isCorrect,
    ).length
    session.score = validCorrectCount

    const totalQuestionsCount = await TestQuestionModel.countDocuments({
      level: { $in: session.levels as QuestionLevelType[] },
    })

    const scorePercentage = totalQuestionsCount
      ? validCorrectCount / totalQuestionsCount
      : 0

    let certification = null
    let retakeAllowed = true
    let nextStep = null
    const step = session.step

    /**
     * |---------------------------------------------------------
     * | Check if user has passed the exam
     *
     * | In Step 1.
     * | 1. If score is less than 25%, user is disqualified
     * | 2. If score is greater than or equal to 25% or 50% or 75%, user is certified
     * |---------------------------------------------------------
     */
    if (step === 1) {
      if (scorePercentage < 0.25) {
        certification = "fail"
        retakeAllowed = false
      } else if (scorePercentage < 0.5) {
        certification = "A1 certified"
      } else if (scorePercentage < 0.75) {
        certification = "A2 certified"
      } else {
        certification = "A2 certified + proceed to step 2"
        nextStep = 2
      }
    } else if (step === 2) {
      /**
       * |---------------------------------------------------------
       * |  Check if user has passed the exam
       *
       * | In Step 2.
       * | 1. If score is less than 25%, user is certified
       * | 2. If score is greater than or equal to 25% or 50% or 75%, user is certified
       * |---------------------------------------------------------
       */
      if (scorePercentage < 0.25) {
        certification = "remain at A2"
      } else if (scorePercentage < 0.5) {
        certification = "B1 certified"
      } else if (scorePercentage < 0.75) {
        certification = "B2 certified"
      } else {
        certification = "B2 certified + proceed to step 3"
        nextStep = 3
      }
    } else if (step === 3) {
      if (scorePercentage < 0.25) {
        certification = "remain at B2"
      } else if (scorePercentage < 0.5) {
        certification = "C1 certified"
      } else {
        certification = "C2 certified"
      }
    }

    if (session.answers.length >= totalQuestionsCount) {
      session.status = certification === "fail" ? "failed" : "passed"
      session.endedAt = new Date()
      session.retakeAllowed = retakeAllowed

      await session.save()

      /**
       * |---------------------------------------------------------
       * | Update user's current level and status
       * |---------------------------------------------------------
       */
      let level = "None"
      let userStatus = "active"
      if (certification === "fail") {
        userStatus = "disqualified"
      } else if (certification && !certification.startsWith("remain")) {
        level = certification.split(" ")[0]
      }

      await UserModel.findByIdAndUpdate(userId, {
        currentLevel: level,
        status: userStatus,
      })
    }

    await session.save()

    return response({
      message: "Answers submitted successfully",
      data: {
        session: {
          ...session?.toObject(),
          answers: null,
        },
        certification,
        nextStep,
        scorePercentage: Math.round(scorePercentage * 100),
      },
    })
  }
}
