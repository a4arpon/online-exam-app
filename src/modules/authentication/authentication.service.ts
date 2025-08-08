import { randomInt } from "node:crypto"
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import bcrypt from "bcrypt"
import { FastifyReply, FastifyRequest } from "fastify"
import { sign, verify } from "jsonwebtoken"
import { IMiddlewareUser } from "~/interfaces/user.interface"
import { env } from "~/libs/env.lib"
import { sendMail } from "~/libs/nodemailer"
import { response } from "~/libs/response"
import { UserModel } from "~/schemas/user.schema"
import { LoginDto, RegisterDto } from "./authentication.dto"

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
      .send({
        message: "Login successful",
        data: user,
      })
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

  async verifyOTP(body: { email: string; OTP: number }) {
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
      throw new BadRequestException("OTP not found")
    }

    if (cache.OTP !== body?.OTP) {
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
    ) as IMiddlewareUser

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
}
