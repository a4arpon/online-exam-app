import { universitiesServices } from "@app/services/universities.services"
import useSWRImmutable from "swr/immutable"

export const useUniversities = (country?: string) => {
  const { data, isLoading, mutate } = useSWRImmutable(
    `universities:${country ?? "N-A"}`,
    universitiesServices.getUniversities,
  )

  const refresh = () => mutate(data)

  return {
    universities: data,
    isUniversitiesLading: isLoading,
    refreshUniversities: refresh,
  }
}
