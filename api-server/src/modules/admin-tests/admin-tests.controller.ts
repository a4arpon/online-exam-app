import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ApiQuery } from "@nestjs/swagger"
import { AdminGuard } from "~/auth-guard/admin.guard"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IContextUser } from "~/interfaces/user.interface"
import { CreateQuestionDto, CreateQuestionsBulkDto } from "./admin-tests.dto"
import { AdminTestsService } from "./admin-tests.service"

@UseGuards(AuthGuard, AdminGuard)
@Controller("admin-tests")
export class AdminTestsController {
  constructor(readonly adminTestsService: AdminTestsService) {}

  @Get("competencies")
  getAllCompetencies() {
    return this.adminTestsService.getAllCompetencies()
  }

  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @Get("questions")
  getAllQuestions(@Query("page") page: string, @Query("limit") limit: string) {
    const _page = Number(page)
    const _limit = Number(limit)
    return this.adminTestsService.getAllQuestions(_page, _limit)
  }

  @Get("questions/:level")
  getAllQuestionsByLevel(@Param("level") level: string) {
    return this.adminTestsService.getAllQuestionsByLevel(level)
  }

  @Post("questions")
  createQuestion(
    @Body() body: CreateQuestionDto,
    @ContextUser() { user }: IContextUser,
  ) {
    return this.adminTestsService.createQuestion(body, user)
  }

  @Post("questions/bulk")
  createQuestions(
    @Body() body: CreateQuestionsBulkDto,
    @ContextUser() { user }: IContextUser,
  ) {
    return this.adminTestsService.createQuestions(body, user)
  }

  @Delete("questions/:id")
  removeQuestion(@Param("id") id: string) {
    return this.adminTestsService.removeQuestion(id)
  }
}
