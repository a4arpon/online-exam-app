import { model, Schema } from "mongoose"
import { ICertificate } from "~/interfaces/certificates.interface"

const CertificateSchema = new Schema<ICertificate>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  examSession: {
    type: Schema.Types.ObjectId,
    ref: "ExamSession",
    required: true,
  },
  step: { type: Number, required: true },
  score: { type: Number, required: true },
  scorePercentage: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
  userName: { type: String, required: true },
  levelName: { type: String, required: true },
})

export const Certificate = model<ICertificate>("Certificate", CertificateSchema)
