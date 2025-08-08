import { Body, Controller, Post, Res } from "@nestjs/common"
import { FastifyReply } from "fastify"
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
}
