import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { FastifyReply } from "fastify"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Internal server error"

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        // biome-ignore lint/suspicious/noExplicitAny: true
        const responseObj = exceptionResponse as any
        message = responseObj.message || responseObj.error || message
      }
    }

    if (!(exception instanceof HttpException)) {
      console.error("Unexpected error:", exception)
    }

    response.status(status).send({
      success: false,
      status,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
    })
  }
}
