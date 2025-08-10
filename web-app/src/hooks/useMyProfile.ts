import { userServices } from "@app/services/user.services"
import useSWRImmutable from "swr/immutable"

export const useMyCurrentProgress = () => {
  const { data, isLoading } = useSWRImmutable(
    "my-progress",
    userServices.myCurrentProgress,
  )

  return {
    myProgress: data,
    isLoadingProcess: isLoading,
  }
}

export const useMyCurrentSession = () => {
  const { data, isLoading } = useSWRImmutable(
    "my-session",
    userServices.myCurrentSession,
  )

  return {
    mySession: data,
    isLoadingSession: isLoading,
  }
}
