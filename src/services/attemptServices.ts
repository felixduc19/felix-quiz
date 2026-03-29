import { apiClient } from "@/lib/apiClient"
import type {
  AttemptInfoResponse,
  AttemptResultResponse,
  QuizAnswer,
} from "@/types"

export const attemptServices = {
  startAttempt: async (quizId: string): Promise<AttemptInfoResponse> => {
    const response = await apiClient.post("/attempts", { quizId })
    return response.data
  },

  attemptAnswer: async ({
    attemptId,
    answer,
  }: {
    attemptId: number
    answer: QuizAnswer
  }) => {
    const response = await apiClient.post(
      `/attempts/${attemptId}/answer`,
      answer
    )
    return response.data
  },

  submitAttempt: async (attemptId: number): Promise<AttemptResultResponse> => {
    const response = await apiClient.post(`/attempts/${attemptId}/submit`)
    return response.data
  },

  trackAntiCheatEvent: async (attemptId: number, event: string) => {
    return await apiClient.post(`/attempts/${attemptId}/events`, { event })
  },
}
