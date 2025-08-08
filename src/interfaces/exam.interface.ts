import { Document } from "mongoose"
import { IQuestion, QuestionLevelType } from "./question.interface"
import { IUser } from "./user.interface"

export type ExamStep = 1 | 2 | 3

export interface IQuestionAnswer {
  question: IQuestion
  selected: string
}

export interface IExamAttempt extends Document {
  user: IUser
  step: ExamStep
  questions: IQuestionAnswer[]
  score: number
  passedLevel: QuestionLevelType | null
  status: "completed" | "failed"
  startedAt: string
  endedAt: string
}
