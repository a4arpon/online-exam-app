import { BadRequestException, Injectable } from "@nestjs/common"
import { response } from "~/libs/response"
import { Certificate } from "~/schemas/certificates.schema"

@Injectable()
export class CertificatesService {
  async getMyCertificates(user: string) {
    const certificates = await Certificate.find({ user })

    if (!certificates) {
      throw new BadRequestException("No certificates found")
    }

    return response({
      message: "Certificates fetched successfully",
      data: certificates,
    })
  }

  async getCertificate(user: string, certificateID: string) {
    const certificate = await Certificate.findOne({
      user,
      _id: certificateID,
    })

    if (!certificate) {
      throw new BadRequestException("Certificate not found")
    }

    return response({
      message: "Certificate fetched successfully",
      data: certificate,
    })
  }
}
