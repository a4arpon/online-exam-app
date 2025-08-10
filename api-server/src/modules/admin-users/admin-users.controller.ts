import { Controller, Get, UseGuards } from "@nestjs/common"
import { AdminGuard } from "~/auth-guard/admin.guard"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { AdminUsersService } from "./admin-users.service"

@UseGuards(AuthGuard, AdminGuard)
@Controller("admin-users")
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  getAllUsers() {
    return this.adminUsersService.getAllUsers()
  }
}
