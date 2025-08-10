import { config } from "dotenv"

config()

export const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  JWT_SECRET: process.env.JWT_SECRET,
  GMAIL_SMTP_MAIL_ADDRESS: process.env.GMAIL_SMTP_MAIL_ADDRESS,
  GMAIL_SMTP_APP_PASSWORD: process.env.GMAIL_SMTP_APP_PASSWORD,
  COOKIE_SIGNATURE: process.env.COOKIE_SIGNATURE,
}
