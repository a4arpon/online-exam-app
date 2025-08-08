import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER } from "@nestjs/core"
import { HttpExceptionFilter } from "./libs/http-exception.filter"
import { connectDB } from "./libs/mongoose"
import { AdminCertificatesModule } from "./modules/admin-certificates/admin-certificates.module"
import { AdminTestsModule } from "./modules/admin-tests/admin-tests.module"
import { AuthenticationModule } from "./modules/authentication/authentication.module"
import { CertificatesModule } from "./modules/certificates/certificates.module"
import { TestsModule } from "./modules/tests/tests.module"

@Module({
  imports: [
    /**
     * |---------------------------------------------------
     * | Config Module
     * |---------------------------------------------------
     */
    ConfigModule.forRoot({ isGlobal: true }),
    AuthenticationModule,
    CertificatesModule,
    AdminCertificatesModule,
    AdminTestsModule,
    TestsModule,

    /**
     * |---------------------------------------------------
     * | Application Modules
     * |---------------------------------------------------
     */
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor() {
    connectDB()
  }
}
