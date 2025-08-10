import { BadRequestException, Injectable } from "@nestjs/common"
import { response } from "~/libs/response"
import { TestQuestionModel } from "~/schemas/questions.schema"
import { CreateQuestionDto, CreateQuestionsBulkDto } from "./admin-tests.dto"

@Injectable()
export class AdminTestsService {
  private readonly competencies = [
    "Reading Comprehension",
    "Listening Comprehension",
    "Speaking Fluency",
    "Writing Skills",
    "Grammar Knowledge",
    "Vocabulary Range",
    "Pronunciation Accuracy",
    "Spelling Accuracy",
    "Critical Thinking",
    "Problem Solving",
    "Creativity",
    "Collaboration",
    "Time Management",
    "Adaptability",
    "Research Skills",
    "Attention to Detail",
    "Decision Making",
    "Cultural Awareness",
    "Technical Knowledge",
    "Digital Literacy",
    "Self-Management",
    "Analytical Skills",
  ]

  async createQuestion(body: CreateQuestionDto, userID: string) {
    if (!this.competencies.includes(body.competency)) {
      throw new BadRequestException("Invalid competency")
    }

    const exists = await TestQuestionModel.findOne({
      competency: body?.competency,
      level: body?.level,
    }).select("_id")

    if (exists) {
      throw new BadRequestException(
        "Question for this competency and level already exists",
      )
    }

    await TestQuestionModel.create({
      ...body,
      createdBy: userID,
    })

    return response({
      message: "Question created successfully",
    })
  }

  async createQuestions({ questions }: CreateQuestionsBulkDto, userID: string) {
    await TestQuestionModel.insertMany(
      questions.map((question) => ({ ...question, createdBy: userID })),
    )

    return response({
      message: "Questions created successfully",
    })
  }

  async getAllQuestions(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [questions, total] = await Promise.all([
      TestQuestionModel.find().skip(skip).limit(limit),
      TestQuestionModel.countDocuments(),
    ])

    return response({
      message: "Questions fetched successfully",
      data: questions,
      extra: {
        totalDocuments: total,
        currentPage: page,
        currentPageLimit: limit,
      },
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

  async getAllQuestionsByLevel(level: string) {
    const [questions, total] = await Promise.all([
      TestQuestionModel.find({
        level: level,
      }),
      TestQuestionModel.countDocuments({ level: level }),
    ])

    return response({
      message: "Questions fetched successfully",
      data: questions,
      extra: {
        totalDocuments: total,
        totalTime: questions.reduce((acc, q) => acc + (q.timeLimit || 0), 0),
      },
    })
  }
}
