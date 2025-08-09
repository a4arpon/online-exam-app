import { model, Schema } from "mongoose"
import { IQuestion } from "~/interfaces/question.interface"

const TestQuestionSchema = new Schema<IQuestion>(
  {
    competency: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeLimit: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true },
)

export const TestQuestionModel = model<IQuestion>(
  "TestQuestion",
  TestQuestionSchema,
)
