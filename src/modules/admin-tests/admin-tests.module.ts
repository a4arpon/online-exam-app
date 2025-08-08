import { Module } from "@nestjs/common"
import { AdminTestsController } from "./admin-tests.controller"
import { AdminTestsService } from "./admin-tests.service"

@Module({
  controllers: [AdminTestsController],
  providers: [AdminTestsService],
})
export class AdminTestsModule {}
