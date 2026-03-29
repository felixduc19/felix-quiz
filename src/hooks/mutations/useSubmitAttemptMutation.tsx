import { getErrorMessage } from "@/lib/utils"
import { attemptServices } from "@/services/attemptServices"
import type { QuizAnswer } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useSubmitAttemptMutation = () => {
  const { mutateAsync: submitAttemptAnswer, isPending: isPendingSubmitAnswer } =
    useMutation({
      mutationFn: attemptServices.attemptAnswer,
    })

  const {
    mutateAsync: submitAttempt,
    isPending: isPendingSubmit,
    data: submitAttemptData,
  } = useMutation({
    mutationFn: attemptServices.submitAttempt,
  })

  const submit = async ({
    attemptId,
    answers,
  }: {
    attemptId: number
    answers: QuizAnswer[]
  }) => {
    try {
      await Promise.all(
        answers.map((answer: QuizAnswer) =>
          submitAttemptAnswer({ attemptId, answer })
        )
      )
    } catch (error) {
      toast.error(getErrorMessage(error) || "Answer submitted failed")
      throw error
    }

    try {
      await submitAttempt(attemptId)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Attempt submitted failed")
    }
  }

  return {
    submit,
    data: submitAttemptData,
    isSubmitting: isPendingSubmitAnswer || isPendingSubmit,
  }
}
