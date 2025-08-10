import bcrypt from "bcrypt"
import { model, Schema } from "mongoose"
import { IUser } from "~/interfaces/user.interface"

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "supervisor", "student"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    currentLevel: {
      type: String,
      enum: ["None", "A1", "A2", "B1", "B2", "C1", "C2"],
      default: "None",
    },
    status: {
      type: String,
      enum: ["active", "disqualified"],
      default: "active",
    },
  },
  { timestamps: true },
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

export const UserModel = model<IUser>("User", UserSchema)
