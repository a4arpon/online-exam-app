import axios, { type AxiosRequestConfig, isAxiosError } from "axios"
import { toast } from "sonner"

export const httpInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: {
  resolve: (value?: any) => void
  reject: (error?: any) => void
}[] = []

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

export async function httpClient<T = any>({
  method,
  url,
  payload,
  params,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  url: string
  payload?: object | null | []
  params?: Record<string, string | number>
}): Promise<{
  success: boolean
  message: string
  data?: T | null
  extra?: object
} | null> {
  let toaster: string | number = "xxxxx-toast"
  if (method !== "GET") {
    toaster = toast.loading("Please wait...")
  }

  const makeRequest = async (): Promise<{
    success: boolean
    message: string
    data?: T | null
    extra?: object
  }> => {
    try {
      const response = await httpInterceptor.request<T>({
        method: method.toLowerCase() as AxiosRequestConfig["method"],
        url,
        data: payload,
        params,
      })
      toast.dismiss(toaster)
      return response.data as {
        success: boolean
        message: string
        data?: T | null
        extra?: object
      }
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.data?.message === "Access token missing"
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(() => makeRequest())
        }

        isRefreshing = true
        try {
          await httpInterceptor.put("/authentication/refresh-token")
          isRefreshing = false
          processQueue(null)
          return makeRequest()
        } catch (refreshError) {
          isRefreshing = false
          processQueue(refreshError, null)
          toast.error("Session expired, please login again.", { id: toaster })
          return {
            success: false,
            message: "Session expired, please login again.",
            data: null,
          }
        }
      }

      toast.dismiss(toaster)

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
        toast.error(error.message, { id: toaster })
        return {
          success: false,
          message: error.message,
          data: null,
        }
      }

      toast.error("Unknown error", { id: toaster })
      return {
        success: false,
        message: "Unknown error",
        data: null,
      }
    }
  }

  return makeRequest()
}
