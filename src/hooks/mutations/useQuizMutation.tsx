import { getErrorMessage } from "@/lib/utils"
import { quizServices } from "@/services/quizServices"
import type { Question, QuizResponse, QuizSubmission } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateQuiz = () => {
  return useMutation({
    mutationFn: quizServices.createQuiz,
  })
}

export const useCreateQuestion = () => {
  return useMutation({
    mutationFn: quizServices.createQuestionsForQuiz,
  })
}

export const useSubmitQuizForm = () => {
  const {
    mutateAsync: createQuiz,
    isPending: isPendingCreateQuiz,
    data: quizData,
  } = useCreateQuiz()
  const { mutateAsync: createQuestion, isPending: isPendingCreateQuestion } =
    useCreateQuestion()

  const isLoading = isPendingCreateQuiz || isPendingCreateQuestion

  const submit = async (formData: QuizSubmission) => {
    let newQuiz: QuizResponse | null = null
    try {
      newQuiz = await createQuiz(formData.quiz)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Quiz created failed")
    }

    try {
      if (newQuiz) {
        await Promise.all(
          formData.questions.map((question: Question) =>
            createQuestion({ question, quizId: newQuiz.id })
          )
        )
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || "Questions created failed")
    }
  }

  return { submit, isLoading, data: quizData }
}
