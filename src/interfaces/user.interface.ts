import { Document } from "mongoose"
import { QuestionLevelType } from "./question.interface"

export type UserRole = "admin" | "student" | "supervisor"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  isVerified: boolean
  currentLevel: QuestionLevelType
  status: "active" | "disqualified"
}

export interface IContextUser {
  user: string
  role: UserRole
}
