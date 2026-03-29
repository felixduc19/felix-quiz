import { apiClient } from "@/lib/apiClient"
import { type Question, type Quiz, type QuizResponse } from "@/types"

export const quizServices = {
  createQuiz: async (quizInfo: Quiz): Promise<QuizResponse> => {
    const response = await apiClient.post("/quizzes", quizInfo)
    return response.data
  },

  createQuestionsForQuiz: async (payload: {
    quizId: number
    question: Question
  }) => {
    const { quizId, question } = payload
    const response = await apiClient.post(
      `/quizzes/${quizId}/questions`,
      question
    )

    return response.data
  },
}
