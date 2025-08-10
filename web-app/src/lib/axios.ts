import axios, { isAxiosError } from "axios"
import { toast } from "sonner"

export const httpInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  withCredentials: true,
})

/**
 * |---------------------------------------------------------
 * | SWR Fetcher
 *
 * | SWR react data fetching hook
 * |---------------------------------------------------------
 */

export const swrFetcher = async (key: string) => {
  try {
    const response = await httpInterceptor.get(`${key}`)
    return response.data
  } catch (_error) {
    return null
  }
}

interface HttpAsyncParams {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  url: string
  payload?: object | null | []
  params?: Record<string, string | number>
}

// biome-ignore lint/suspicious/noExplicitAny: true
interface ResponseType<T = any> {
  success: boolean
  message: string
  data?: T | null
  extra?: object
}

/**
 * |---------------------------------------------------------
 * | HTTP Client
 *
 * | This is a wrapper around Axios to handle the HTTP requests
 * | and responses. It also handles the toast notifications.
 * |---------------------------------------------------------
 */

// biome-ignore lint/suspicious/noExplicitAny: true
export async function httpClient<T = any>({
  method,
  url,
  payload,
  params,
}: HttpAsyncParams): Promise<ResponseType<T> | null> {
  let toaster: string | number = "xxxxx-toast"
  if (method !== "GET") {
    toaster = toast.loading("Please wait...")
  }
  try {
    const response = await httpInterceptor.request<T>({
      method: method?.toLowerCase(),
      url: url,
      data: payload,
      params: params,
    })

    const result = await response?.data

    toast.dismiss(toaster)

    return result as ResponseType
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`${error.status} : ${error?.response?.data?.message}`, {
        id: toaster,
      })
      return {
        success: false,
        message: error?.response?.data?.message,
        data: null,
      }
    }

    if (error instanceof Error) {
      toast.error(error?.message, {
        id: toaster,
      })
      return {
        success: false,
        message: error?.message,
        data: null,
      }
    }

    toast.error("Unknown error", {
      id: toaster,
    })

    return {
      success: false,
      message: "Unknown error",
      data: null,
    }
  }
}
