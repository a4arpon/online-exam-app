import { BadRequestException, Injectable } from "@nestjs/common"
import { response } from "~/libs/response"
import { ExamSessionModel } from "~/schemas/exam-session.schema"
import { TestQuestionModel } from "~/schemas/questions.schema"
import { SubmissionService } from "./submission.service"

@Injectable()
export class TestsService extends SubmissionService {
  getLevels() {
    return response({
      message: "Levels fetched successfully",
      data: [
        { level: "A1", description: "Beginner", requiredLevel: null },
        { level: "A2", description: "Elementary", requiredLevel: "A1" },
        { level: "B1", description: "Intermediate", requiredLevel: "A2" },
        { level: "B2", description: "Upper-Intermediate", requiredLevel: "B1" },
        { level: "C1", description: "Advanced", requiredLevel: "B2" },
        { level: "C2", description: "Proficient", requiredLevel: "C1" },
      ],
    })
  }

  getCompetencies() {
    return response({
      message: "Competencies fetched successfully",
      data: [
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
      ],
    })
  }

  async getAllQuestionsListByLevel(level: string) {
    const [questions, totalQuestions] = await Promise.all([
      TestQuestionModel.find({
        level: level,
      }).select("-createdBy -correctAnswer"),
      TestQuestionModel.countDocuments({ level: level }),
    ])

    return response({
      message: "Questions fetched successfully",
      data: questions,
      extra: {
        totalDocuments: totalQuestions,
        totalTime: questions.reduce((acc, q) => acc + (q.timeLimit || 0), 0),
      },
    })
  }

  async getQuestion(questionID: string) {
    const question = await TestQuestionModel.findById(questionID).select(
      "-correctAnswer -createdBy",
    )

    if (!question) {
      throw new BadRequestException("Question not found")
    }

    return response({
      message: "Question fetched successfully",
      data: question,
    })
  }

  async initiateExamSession(user: string, step: number) {
    const activeSession = await ExamSessionModel.findOne({
      user,
      step,
      status: "in-progress",
    })

    if (activeSession) {
      return response({
        message: "Existing in-progress session found",
        data: activeSession,
      })
    }

    const levelsByStep = this.getLevelsByStep(step)

    const newSession = await ExamSessionModel.create({
      user: user,
      step: step,
      levels: levelsByStep,
      startedAt: new Date(),
      status: "in-progress",
      retakeAllowed: true,
      answers: [],
    })

    return response({
      message: "Session created successfully",
      data: newSession,
    })
  }
}
