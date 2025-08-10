import { Controller } from "@nestjs/common"
import { AdminCertificatesService } from "./admin-certificates.service"

@Controller("admin-certificates")
export class AdminCertificatesController {
  constructor(readonly _adminCertificatesService: AdminCertificatesService) {}
}
