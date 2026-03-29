import z from "zod"

export const attemptFormSchema = z.object({
  quizId: z.string().regex(/^\d+$/, "Only numbers allowed"),
})
