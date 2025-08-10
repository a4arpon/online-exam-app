import type { TSchema } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"

type ValidationResult = {
  isValidated: boolean
  errorMessage?: string
}

export function isValidPayload<T extends TSchema>(
  schema: T,
  payload: unknown,
): ValidationResult {
  const result = Value.Check(schema, payload)

  if (result) {
    return { isValidated: true }
  } else {
    const error = Value.Errors(schema, payload).First()
    return {
      isValidated: false,
      errorMessage: `'${error?.path}' ${error?.message}`,
    }
  }
}
