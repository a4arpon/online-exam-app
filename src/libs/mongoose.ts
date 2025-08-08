import mongoose from "mongoose"
import { env } from "./env.lib"

export const connectDB = () =>
  mongoose.connect(env.DATABASE_URL, {
    autoIndex: false,
    dbName: "school-platform",
    retryWrites: true,
  })
