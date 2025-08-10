import { Schema } from "mongoose"

const CertificateSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  examSession: {
    type: Schema.Types.ObjectId,
    ref: "ExamSession",
    required: true,
  },
  step: Number,
  score: Number,
  issuedAt: { type: Date, default: Date.now },
})
