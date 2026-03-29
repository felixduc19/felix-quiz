import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useStartAttemptMutation } from "@/hooks/mutations/useStartAttemptMutation"
import { attemptFormSchema } from "@/schema/attemptFormSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Code, PenTool, Play } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import type z from "zod"

export default function Home() {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(attemptFormSchema),
    defaultValues: {
      quizId: "",
    },
    mode: "onSubmit",
  })

  const { mutate, isPending } = useStartAttemptMutation()

  const handleStartAttempt = (data: z.infer<typeof attemptFormSchema>) => {
    mutate(data.quizId, {
      onSuccess: (data) => {
        if (data.quizId.trim()) {
          navigate(`/quiz/${data.quizId.trim()}`)
        }
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-fade-in w-full max-w-lg">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              Felix<span className="text-primary">Quiz</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Create and take coding quizzes with anti-cheat monitoring.
          </p>
        </div>

        <div className="space-y-4">
          <Card className="quiz-card p-6">
            <div className="mb-3 flex items-center gap-3">
              <PenTool className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Create a Quiz</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Build a quiz with multiple choice and short answer questions.
            </p>
            <Button onClick={() => navigate("/creator")} className="w-full">
              Open Builder
            </Button>
          </Card>

          <Card className="quiz-card p-6">
            <div className="mb-3 flex items-center gap-3">
              <Play className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Take a Quiz</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Enter a quiz ID to start answering questions.
            </p>
            <form
              onSubmit={form.handleSubmit(handleStartAttempt)}
              id="start-quiz-form"
              className="flex gap-2"
            >
              <Controller
                name="quizId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      placeholder="Enter quiz ID..."
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        form.handleSubmit(handleStartAttempt)()
                      }
                      className="font-mono"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                form="start-quiz-form"
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-18 px-4"
                isLoading={isPending}
              >
                Start
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
