import { QuestionType } from "@/types"
import { z } from "zod"

export const mcqQuestionSchema = z.object({
  type: z.literal(QuestionType.MCQ),
  prompt: z.string().min(1, "Question prompt is required"),
  options: z.array(
    z.object({
      value: z.string().min(1, "Option is required"),
    })
  ),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  position: z.number(),
})

export const shortAnswerQuestionSchema = z.object({
  type: z.literal(QuestionType.ShortAnswer),
  prompt: z.string().min(1, "Question prompt is required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  position: z.number(),
})

export const quizFormSchema = z.object({
  title: z
    .string()
    .min(1, "Quiz title is required")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(1, "Quiz description is required")
    .max(200, "Description is too long"),
  questions: z.array(
    z.discriminatedUnion("type", [mcqQuestionSchema, shortAnswerQuestionSchema])
  ),
  timeLimitMinutes: z.string().nullable(),
})

export type QuizFormType = z.infer<typeof quizFormSchema>
