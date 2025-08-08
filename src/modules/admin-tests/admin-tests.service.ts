import { BadRequestException, Injectable } from "@nestjs/common"
import { response } from "~/libs/response"
import { TestQuestionModel } from "~/schemas/questions.schema"
import { CreateQuestionDto } from "./admin-tests.dto"

@Injectable()
export class AdminTestsService {
  private readonly competencies = [
    "Reading Comprehension",
    "Grammar",
    "Vocabulary",
    "Listening Skills",
    "Writing Skills",
    "Speaking Skills",
    "Digital Literacy",
    "Problem Solving",
    "Data Interpretation",
    "Communication Skills",
  ]

  async createQuestion(body: CreateQuestionDto, userID: string) {
    if (!this.competencies.includes(body.competency)) {
      throw new BadRequestException("Invalid competency")
    }

    await TestQuestionModel.create({
      ...body,
      createdBy: userID,
    })

    return response({
      message: "Question created successfully",
    })
  }

  async createQuestions(body: CreateQuestionDto[], userID: string) {
    await TestQuestionModel.insertMany(
      body.map((question) => ({ ...question, createdBy: userID })),
    )

    return response({
      message: "Questions created successfully",
    })
  }

  async getAllQuestions() {
    const questions = await TestQuestionModel.find()

    return response({
      message: "Questions fetched successfully",
      data: questions,
    })
  }

  async removeQuestion(id: string) {
    await TestQuestionModel.deleteOne({ _id: id })

    return response({
      message: "Question removed successfully",
    })
  }

  async getAllCompetencies() {
    return response({
      message: "Competencies fetched successfully",
      data: this.competencies,
    })
  }
}
