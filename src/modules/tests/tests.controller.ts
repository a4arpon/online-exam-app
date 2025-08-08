import { Controller, Get, Param } from "@nestjs/common"
import { TestsService } from "./tests.service"

@Controller("tests")
export class TestsController {
  constructor(readonly testsService: TestsService) {}

  @Get(":level")
  getAllQuestions(@Param("level") level: string) {
    return this.testsService.getAllQuestions(level)
  }
}
