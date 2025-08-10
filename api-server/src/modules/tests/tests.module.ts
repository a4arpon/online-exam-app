import { Module } from "@nestjs/common"
import { SubmissionService } from "./submission.service"
import { TestsController } from "./tests.controller"
import { TestsService } from "./tests.service"

@Module({
  controllers: [TestsController],
  providers: [TestsService, SubmissionService],
})
export class TestsModule {}
