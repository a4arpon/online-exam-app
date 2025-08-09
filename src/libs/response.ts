export function response(resp: {
  message: string
  data?: object | [] | null | undefined
  success?: boolean
  status?: number
  extra?: object
}) {
  return {
    message: resp?.message,
    success: resp?.success ?? true,
    data: resp?.data ?? null,
    status: resp?.status ?? 200,
    extra: resp?.extra ?? {},
  }
}
