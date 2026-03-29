import { attemptServices } from "@/services/attemptServices"
import type { AttemptInfoResponse } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useAttemptQuery = (quizId: string) => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["attempts", quizId],
    queryFn: async () => {
      const cachedData: AttemptInfoResponse | undefined =
        queryClient.getQueryData(["attempts", quizId])
      if (!cachedData) {
        return await attemptServices.startAttempt(quizId)
      } else {
        return cachedData
      }
    },

    enabled: !!quizId,
  })

  return { data, isLoading }
}
