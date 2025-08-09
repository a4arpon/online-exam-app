import { Document, Types } from "mongoose"
import { QuestionLevelType } from "./question.interface"
import { IUser } from "./user.interface"

export enum AnswerStatus {
  VALID = "valid",
  TIMEOUT = "timeout",
  INVALID = "invalid",
}

export interface IExamSession extends Document {
  user: IUser
  step: number
  levels: QuestionLevelType[]
  startedAt: Date
  endedAt?: Date
  score?: number
  status?: "passed" | "failed" | "in-progress"
  retakeAllowed: boolean

  answers: {
    question: Types.ObjectId
    selectedOption: string
    isCorrect: boolean
    answeredAt: Date
    status: AnswerStatus
  }[]
}
