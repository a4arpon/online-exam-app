import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common"
import { AdminGuard } from "~/auth-guard/admin.guard"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IContextUser } from "~/interfaces/user.interface"
import { CreateQuestionDto } from "./admin-tests.dto"
import { AdminTestsService } from "./admin-tests.service"

@UseGuards(AuthGuard, AdminGuard)
@Controller("admin-tests")
export class AdminTestsController {
  constructor(readonly adminTestsService: AdminTestsService) {}

  @Get("competencies")
  getAllCompetencies() {
    return this.adminTestsService.getAllCompetencies()
  }

  @Get("questions")
  getAllQuestions() {
    return this.adminTestsService.getAllQuestions()
  }

  @Post("questions")
  createQuestion(
    @Body() body: CreateQuestionDto,
    @ContextUser() { user }: IContextUser,
  ) {
    return this.adminTestsService.createQuestion(body, user)
  }

  @Delete("questions/:id")
  removeQuestion(@Param("id") id: string) {
    return this.adminTestsService.removeQuestion(id)
  }
}
