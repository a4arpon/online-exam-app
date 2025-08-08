import nodemailer, { SendMailOptions } from "nodemailer"
import { env } from "./env.lib"

const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_SMTP_MAIL_ADDRESS,
    pass: env.GMAIL_SMTP_APP_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
})

// mailTransporter
//   .verify()
//   .then(() => {
//     console.log("[mailer] Transporter verified")
//   })
//   .catch((err) => {
//     console.warn(
//       "[mailer] Transporter verification failed:",
//       err?.message ?? err,
//     )
//   })

type MailSendArgs = {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendMail(
  opts: MailSendArgs,
): Promise<nodemailer.SentMessageInfo> {
  const mailOptions: SendMailOptions = {
    from: `"Hunan Govt. High School" <${env.GMAIL_SMTP_MAIL_ADDRESS}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  }

  return mailTransporter.sendMail(mailOptions)
}
