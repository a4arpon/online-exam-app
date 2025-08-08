import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { IMiddlewareUser } from "~/interfaces/user.interface"

declare module "fastify" {
  interface FastifyRequest {
    user: IMiddlewareUser
  }
}

export const ContextUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IMiddlewareUser | undefined => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>()
    return request.user
  },
)
