import { model, Schema } from "mongoose"
import { IExamSession } from "~/interfaces/exam.interface"

const ExamAnswerSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "TestQuestion",
      required: true,
    },
    selectedOption: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    questionStartedAt: { type: Date, required: true },
    answeredAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["valid", "timeout", "invalid", "unknown"],
      default: "unknown",
    },
  },
  { _id: true },
)

const ExamSessionSchema = new Schema<IExamSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    step: { type: Number, required: true },
    levels: {
      type: [{ type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"] }],
      required: true,
    },
    startedAt: { type: Date, required: true, default: () => new Date() },
    endedAt: { type: Date },
    score: { type: Number },
    status: {
      type: String,
      enum: ["passed", "failed", "in-progress"],
      default: "in-progress",
    },
    retakeAllowed: { type: Boolean, required: true, default: true },

    answers: { type: [ExamAnswerSchema], default: [] },
  },
  { timestamps: true },
)

export const ExamSessionModel = model<IExamSession>(
  "ExamSession",
  ExamSessionSchema,
)
