import { Document, Types } from "mongoose"

export interface ICertificate extends Document {
  user: Types.ObjectId
  examSession: Types.ObjectId
  step: number
  score: number
  issuedAt: Date
  fileUrl: string
}
