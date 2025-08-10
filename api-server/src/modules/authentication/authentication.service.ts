import { randomInt } from "node:crypto"
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import bcrypt from "bcrypt"
import { FastifyReply, FastifyRequest } from "fastify"
import { sign, verify } from "jsonwebtoken"
import { IContextUser } from "~/interfaces/user.interface"
import { env } from "~/libs/env.lib"
import { sendMail } from "~/libs/nodemailer"
import { response } from "~/libs/response"
import { UserModel } from "~/schemas/user.schema"
import { LoginDto, RegisterDto, ResetPasswordDto } from "./authentication.dto"

@Injectable()
export class AuthenticationService {
  /**
   * ---------------------------------------------------------
   * | OTP Caches
   * | ---
   * | OTP Caches are used to store the OTP and its expiration time
   * | for each user. This is used to prevent brute force attacks on the registration
   * | time. The cache is cleared every 5 minutes. Current implementation
   * | uses a Map to store the cache, but it can be easily replaced
   * | with a in-memory database like Redis or Valkey.
   * ---------------------------------------------------------
   */
  private OTP_CACHES = new Map<
    string,
    {
      OTP: number
      createdAt: Date
      subject: "account-verify" | "password-reset"
    }
  >()

  constructor() {
    setInterval(
      () => {
        this.OTP_CACHES.forEach((cache, email) => {
          // removed expired otp from cache
          if (cache.createdAt.getTime() + 1000 * 60 * 5 < Date.now()) {
            this.OTP_CACHES.delete(email)
          }
        })
      },
      1000 * 60 * 5,
    ) // 5 minutes
  }

  async login(data: LoginDto, res: FastifyReply) {
    const user = await UserModel.findOne({ email: data?.email })

    if (!user) throw new UnauthorizedException("Invalid credentials")

    const isMatch = await bcrypt.compare(data?.password, user.password)

    if (!isMatch) throw new UnauthorizedException("Invalid credentials")

    const payload = { user: user?._id, role: user.role }

    const accessToken = sign(payload, env.JWT_SECRET, {
      expiresIn: "1h",
    })

    const refreshToken = sign(
      payload,
      `${env.JWT_SECRET}-refresh-token-signature`,
      {
        expiresIn: "7d",
      },
    )
    user.password = ""

    return res
      .cookie("refresh-token", refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        path: "/",
      })
      .cookie("access-token", accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 55), // 55 minutes
        path: "/",
      })
      .send(
        response({
          message: "Login Successful",
          data: user,
        }),
      )
  }

  async register(body: RegisterDto) {
    const existingUser = await UserModel.findOne({ email: body?.email })

    if (existingUser) {
      throw new BadRequestException("Email is already registered")
    }

    const OTP = randomInt(100000, 999999)

    this.OTP_CACHES.set(body?.email, {
      OTP,
      createdAt: new Date(),
      subject: "account-verify",
    })

    Promise.all([
      await UserModel.create(body),
      await sendMail({
        to: body?.email,
        subject: "Verify your account",
        html: `<p>Your OTP: <strong>${OTP}</strong></p>`,
      }),
    ])

    return response({
      message: "User registered successfully",
    })
  }

  async resendRegisterOTP(email: string) {
    const user = await UserModel.findOne({ email: email }).select(
      "_id email isVerified",
    )

    if (!user) {
      throw new BadRequestException("User not found")
    }

    if (user.isVerified) {
      throw new BadRequestException("User is already verified")
    }

    const newOTP = this.generateOTP()

    this.OTP_CACHES.set(email, {
      createdAt: new Date(),
      OTP: newOTP,
      subject: "account-verify",
    })

    await sendMail({
      to: email,
      subject: "Verify your account",
      html: `<p>Your OTP: <strong>${newOTP}</strong></p>`,
    })

    return response({
      message: "OTP sent to your email",
    })
  }

  async verifyRegisterOTP(body: { email: string; OTP: number }) {
    const user = await UserModel.findOne({ email: body?.email }).select(
      "_id email isVerified",
    )

    if (!user) {
      throw new BadRequestException("User not found")
    }

    if (user.isVerified) {
      throw new BadRequestException("User is already verified")
    }

    const cache = this.OTP_CACHES.get(body?.email)

    if (!cache) {
      throw new BadRequestException("OTP not found or might be expired")
    }

    if (cache.OTP !== body?.OTP) {
      throw new BadRequestException("OTP is invalid")
    }

    if (cache.subject !== "account-verify") {
      throw new BadRequestException("OTP is invalid")
    }

    this.OTP_CACHES.delete(body?.email)

    await UserModel.updateOne({ _id: user?._id }, { isVerified: true })

    return response({
      message: "OTP verified successfully",
    })
  }

  async myProfile(id: string) {
    const user = await UserModel.findById(id).select("-password")

    if (!user) {
      throw new BadRequestException("User not found")
    }

    return response({
      message: "User profile fetched successfully",
      data: user,
    })
  }

  async refreshToken(req: FastifyRequest, res: FastifyReply) {
    const refreshToken = req.cookies?.["refresh-token"]

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing")
    }

    const payload = verify(
      refreshToken,
      `${env.JWT_SECRET}-refresh-token-signature`,
    ) as IContextUser

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token")
    }

    const accessToken = sign(payload, env.JWT_SECRET)

    return res
      .cookie("access-token", accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 55), // 55 minutes
        path: "/",
      })
      .send({
        success: true,
        message: "COOKIE-1",
      })
  }

  private generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
  } // Example output: 123456

  async requestPasswordReset(email: string) {
    const user = await UserModel.findOne({ email })
    if (!user) throw new BadRequestException("User not found")

    const otp = this.generateOTP()

    this.OTP_CACHES.set(email, {
      createdAt: new Date(),
      OTP: otp,
      subject: "password-reset",
    })

    await sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `Your password reset OTP is: ${otp}`,
    })

    return response({
      message: "OTP sent to your email",
    })
  }

  verifyPasswordResetOTP(email: string, otp: number) {
    const otpCache = this.OTP_CACHES.get(email)

    if (!otpCache) {
      return false
    }

    if (otpCache.OTP !== otp) {
      return false
    }

    this.OTP_CACHES.delete(email)

    return true
  }

  async resetPassword(body: ResetPasswordDto) {
    const isValid = this.verifyPasswordResetOTP(body.email, body.otp)

    if (!isValid) {
      throw new BadRequestException("Invalid OTP")
    }

    const user = await UserModel.findOne({ email: body?.email })

    if (!user) {
      throw new BadRequestException("User not found")
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await UserModel.updateOne({ _id: user?._id }, { password: hashedPassword })

    return response({
      message: "Password reset successfully",
    })
  }
}
