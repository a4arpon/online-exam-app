import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common"
import { FastifyReply, FastifyRequest } from "fastify"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IMiddlewareUser } from "~/interfaces/user.interface"
import { LoginDto, RegisterDto, VerifyOTPDto } from "./authentication.dto"
import { AuthenticationService } from "./authentication.service"

@Controller("authentication")
export class AuthenticationController {
  constructor(readonly authenticationService: AuthenticationService) {}

  @Post("login")
  login(@Body() body: LoginDto, @Res() res: FastifyReply) {
    return this.authenticationService.login(body, res)
  }

  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authenticationService.register(body)
  }

  @Post("verify-otp")
  verifyOTP(@Body() body: VerifyOTPDto) {
    return this.authenticationService.verifyOTP(body)
  }

  @UseGuards(AuthGuard)
  @Get("my-profile")
  getMyProfile(@ContextUser() user: IMiddlewareUser) {
    return this.authenticationService.myProfile(user.user)
  }

  @Put("refresh-token")
  refreshToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.authenticationService.refreshToken(req, res)
  }
}
