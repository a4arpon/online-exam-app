import { Injectable } from "@nestjs/common"
import { TestQuestionModel } from "~/schemas/questions.schema"

@Injectable()
export class TestsService {
  async getAllQuestions(level: string) {
    const questions = await TestQuestionModel.find({
      level: level,
    }).select("-createdBy -correctAnswer")

    return {
      message: "Questions fetched successfully",
      data: questions,
    }
  }
}
