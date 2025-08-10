import { testServices } from "@app/services/tests.services"
import useSWRImmutable from "swr/immutable"

export const useTests = (level: string) => {
  const { data: testsQuestions, isLoading } = useSWRImmutable(
    `questions:${level}`,
    () => testServices.getQuestions(level),
  )

  return {
    testsQuestions,
    isLoading,
  }
}
