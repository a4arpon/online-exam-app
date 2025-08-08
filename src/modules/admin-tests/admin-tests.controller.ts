import { Controller } from "@nestjs/common"
import { AdminTestsService } from "./admin-tests.service"

@Controller("admin-tests")
export class AdminTestsController {
  constructor(readonly _adminTestsService: AdminTestsService) {}
}
