import { Document } from "mongoose"
import { IUser } from "./user.interface"

export type OTPType = "email" | "sms"

export interface IOTP extends Document {
  userId: string
  code: string
  type: OTPType
  expiresAt: string
}

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
  user: IUser
}
