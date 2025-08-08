import { Document } from "mongoose"

export type UserRole = "admin" | "student" | "supervisor"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  isVerified: boolean
}

export interface IMiddlewareUser {
  user: string
  role: UserRole
}
