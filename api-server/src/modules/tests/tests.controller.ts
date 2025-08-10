import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IContextUser } from "~/interfaces/user.interface"
import { InitiateExamSessionDto, SubmitAnswersDto } from "./tests.dto"
import { TestsService } from "./tests.service"

@UseGuards(AuthGuard)
@Controller("tests")
export class TestsController {
  constructor(readonly testsService: TestsService) {}

  @Get("levels")
  getLevels() {
    return this.testsService.getLevels()
  }

  @Get("competencies")
  getCompetencies() {
    return this.testsService.getCompetencies()
  }

  @Get("questions/:level/list")
  getAllQuestions(@Param("level") level: string) {
    return this.testsService.getAllQuestionsListByLevel(level)
  }

  @Get("questions/:id")
  getQuestion(@Param("id") id: string) {
    return this.testsService.getQuestion(id)
  }

  @Post("initiate-exam-session")
  initiateExamSession(
    @Body() { step }: InitiateExamSessionDto,
    @ContextUser() { user }: IContextUser,
  ) {
    return this.testsService.initiateExamSession(user, step)
  }

  @Post("submit-answers")
  async submitAnswers(
    @Body() body: SubmitAnswersDto,
    @ContextUser() { user }: IContextUser,
  ) {
    return this.testsService.submitAnswers(user, body)
  }
}
