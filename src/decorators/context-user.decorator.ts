import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { FastifyRequest } from "fastify"
import { IContextUser } from "~/interfaces/user.interface"

declare module "fastify" {
  interface FastifyRequest {
    user: IContextUser
  }
}

export const ContextUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IContextUser | undefined => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>()
    return request.user
  },
)
