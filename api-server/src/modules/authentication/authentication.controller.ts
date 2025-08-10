import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common"
import { FastifyReply, FastifyRequest } from "fastify"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IContextUser } from "~/interfaces/user.interface"
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOTPDto,
} from "./authentication.dto"
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
    return this.authenticationService.verifyRegisterOTP(body)
  }

  @UseGuards(AuthGuard)
  @Get("my-profile")
  getMyProfile(@ContextUser() user: IContextUser) {
    return this.authenticationService.myProfile(user.user)
  }

  @Put("refresh-token")
  refreshToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.authenticationService.refreshToken(req, res)
  }

  @Put("reset-password-request/:email")
  resetPasswordRequest(@Param("email") email: string) {
    return this.authenticationService.requestPasswordReset(email)
  }

  @Put("reset-password")
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authenticationService.resetPassword(body)
  }

  @Patch("register-otp-refresh/:email")
  registerOTPRefresh(@Param("email") email: string) {
    return this.authenticationService.resendRegisterOTP(email)
  }
}
