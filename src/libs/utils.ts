import { randomBytes } from "node:crypto"

export function generateRandomUUID(length = 12) {
  const generatedRandomUUID = randomBytes(length).toString("hex")

  return generatedRandomUUID
}
