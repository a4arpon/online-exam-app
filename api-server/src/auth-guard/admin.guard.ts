import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { FastifyRequest } from "fastify"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const user = request.user

    if (user.role !== "admin") {
      throw new UnauthorizedException("Admin access denied")
    }

    return true
  }
}
