import { getErrorMessage } from "@/lib/utils"
import { attemptServices } from "@/services/attemptServices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useStartAttemptMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: attemptServices.startAttempt,
    onSuccess: (data) => {
      toast.success("Quiz attempt started!", { position: "top-center" })
      queryClient.setQueryData(["attempts", data.quizId], data)
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) ||
          "Failed to start quiz attempt. Please try again."
      )
    },
  })
}
