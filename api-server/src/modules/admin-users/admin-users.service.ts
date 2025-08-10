import { Injectable } from "@nestjs/common"
import { response } from "~/libs/response"
import { UserModel } from "~/schemas/user.schema"

@Injectable()
export class AdminUsersService {
  async getAllUsers() {
    const users = await UserModel.find().select("-password")

    return response({
      message: "Users fetched successfully",
      data: users,
    })
  }
}
