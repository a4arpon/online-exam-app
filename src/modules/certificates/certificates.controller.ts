import { Controller } from "@nestjs/common"
import { CertificatesService } from "./certificates.service"

@Controller("certificates")
export class CertificatesController {
  constructor(readonly _certificatesService: CertificatesService) {}
}
