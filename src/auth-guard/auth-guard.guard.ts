import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { verify } from "jsonwebtoken"
import { IMiddlewareUser } from "~/interfaces/user.interface"
import { env } from "~/libs/env.lib"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest>()
    const token = req.cookies?.["access-token"]

    if (!token) throw new UnauthorizedException("Access token missing")

    try {
      const decoded = verify(token, env.JWT_SECRET) as IMiddlewareUser

      req.user = decoded

      return true
    } catch {
      throw new UnauthorizedException("Invalid or expired access token")
    }
  }
}
