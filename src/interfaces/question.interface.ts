import { Document } from "mongoose"
import { IUser } from "./user.interface"

export type QuestionLevelType = "None" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export interface IQuestion extends Document {
  competency: string
  level: QuestionLevelType
  questionText: string
  options: string[]
  correctAnswer: string
  createdBy: IUser
  timeLimit: number
}
