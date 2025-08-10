import { Module } from "@nestjs/common"
import { AdminCertificatesController } from "./admin-certificates.controller"
import { AdminCertificatesService } from "./admin-certificates.service"

@Module({
  controllers: [AdminCertificatesController],
  providers: [AdminCertificatesService],
})
export class AdminCertificatesModule {}
