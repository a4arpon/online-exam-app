import { Controller, Get, UseGuards } from "@nestjs/common"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IContextUser } from "~/interfaces/user.interface"
import { UserService } from "./user.service"

@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("my-progress")
  getUserProgress(@ContextUser() { user }: IContextUser) {
    return this.userService.getUserProgress(user)
  }

  @Get("user/current-session")
  getCurrentSession(@ContextUser() { user }: IContextUser) {
    return this.userService.getCurrentSession(user)
  }
}
