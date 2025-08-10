import compression from "@fastify/compress"
import fastifyCookie from "@fastify/cookie"
import fastifyHelmet from "@fastify/helmet"
import { NestFactory } from "@nestjs/core"
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { env } from "./libs/env.lib"

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle("Api Server")
    .setVersion("1.0")
    .addTag("Authentication")
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, documentFactory)

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    preflightContinue: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })

  /**
   * |---------------------------------------------------------
   * | Async Middleware Register
   * |---------------------------------------------------------
   */

  await Promise.all([
    app.register(fastifyHelmet, {
      contentSecurityPolicy: false,
    }),
    app.register(compression, {
      encodings: ["gzip", "deflate"],
    }),
    app.register(fastifyCookie, {
      secret: env.COOKIE_SIGNATURE,
    }),
  ])

  await app.listen(process.env.PORT || Number.parseInt(env.PORT), "0.0.0.0")

  console.log(
    `Server is running on port ${env.PORT} : URL => http://localhost:${env.PORT}`,
  )
}

bootstrap().catch((err) => {
  console.error("Application error", err)
  process.exit(1)
})
