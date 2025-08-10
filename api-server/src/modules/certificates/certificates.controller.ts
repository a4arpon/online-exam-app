import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { AuthGuard } from "~/auth-guard/auth-guard.guard"
import { ContextUser } from "~/decorators/context-user.decorator"
import { IContextUser } from "~/interfaces/user.interface"
import { CertificatesService } from "./certificates.service"

@UseGuards(AuthGuard)
@Controller("certificates")
export class CertificatesController {
  constructor(readonly certificatesService: CertificatesService) {}

  @Get("my-certificates")
  getMyCertificates(@ContextUser() { user }: IContextUser) {
    return this.certificatesService.getMyCertificates(user)
  }

  @Get("certificate/:certificateID")
  getCertificate(
    @Param("certificateID") certificateID: string,
    @ContextUser() { user }: IContextUser,
  ) {
    return this.certificatesService.getCertificate(user, certificateID)
  }
}
