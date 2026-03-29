import { CustomAlertDialog } from "@/components/AlertDialog"
import { Loading } from "@/components/Loading"
import { MCQForm } from "@/components/quizCreator/MCQForm"
import ShortQuestionForm from "@/components/quizCreator/ShortQuestionForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { useSubmitQuizForm } from "@/hooks/mutations/useQuizMutation"
import { quizFormSchema, type QuizFormType } from "@/schema/quizFormSchema"
import {
  QuestionType,
  type CodeQuestion,
  type Question,
  type QuizSubmission,
} from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CheckCircle, Clock, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type z from "zod"

export default function QuizCreator() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false)
  const [questionsQuantity, setQuestionsQuantity] = useState(0)

  const { submit, isLoading, data } = useSubmitQuizForm()

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      timeLimitMinutes: null,
      questions: [],
    },
  })

  const { control } = form

  const {
    fields: questionFields,
    append: appendFieldQuestion,
    remove: removeFieldQuestion,
  } = useFieldArray({
    name: "questions",
    control,
  })

  const addMultipleChoice = () => {
    appendFieldQuestion({
      type: QuestionType.MCQ,
      prompt: "",
      options: [{ value: "" }, { value: "" }],
      correctAnswer: "0",
      position: questionFields.length,
    })
    setQuestionsQuantity((prev) => prev + 1)
  }

  const addShortAnswer = () => {
    appendFieldQuestion({
      type: QuestionType.ShortAnswer,
      prompt: "",
      correctAnswer: "",
      position: questionFields.length,
    })
  }

  const addCodeQuestion = () => {
    setQuestionsQuantity((prev) => prev + 1)
    const q: CodeQuestion = {
      type: QuestionType.Code,
      prompt: "",
      position: questionsQuantity,
    }
    setQuestions([...questions, q])
  }

  const removeQuestion = (index: number) => {
    removeFieldQuestion(index)
  }

  const handleSave = async (data: QuizFormType) => {
    if (!data.questions.length) {
      toast.error("Quiz must have at least a question.")
      return
    }

    try {
      const quiz: QuizSubmission = {
        quiz: {
          title: data.title,
          description: data.description,
          timeLimitSeconds: data.timeLimitMinutes
            ? Number(data.timeLimitMinutes) * 60
            : null,
          isPublished: true,
        },
        questions: data.questions.map((q) => {
          if (q.type === QuestionType.MCQ) {
            return {
              ...q,
              options: q.options.map((opt) => opt.value),
            }
          }
          return q
        }),
      }
      await submit(quiz)
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Failed to save quiz. Please try again.")
      return
    }
  }

  const renderBadgeQuestionType = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MCQ:
        return "Multiple Choice"
      case QuestionType.ShortAnswer:
        return "Short Answer"
      case QuestionType.Code:
        return "Code"
      default:
        return null
    }
  }

  if (data && !isLoading && data?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="quiz-card animate-fade-in w-full max-w-md p-8 text-center">
          <CheckCircle className="text-success mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-bold">Quiz Created!</h2>
          <p className="mb-6 text-muted-foreground">
            Share this ID with quiz takers:
          </p>
          <div className="mb-6 rounded-lg bg-secondary p-4">
            <code className="font-mono text-lg font-semibold text-primary">
              {data.id}
            </code>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button onClick={() => navigate(`/quiz/${data.id}`)}>
              Take Quiz
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="animate-fade-in mb-8">
          <h1 className="mb-2 text-3xl font-bold">Create a Quiz</h1>
          <p className="text-muted-foreground">
            Build a coding quiz with multiple choice and short answer questions.
          </p>
        </div>

        <form id="quiz-form" onSubmit={form.handleSubmit(handleSave)}>
          <div className="animate-fade-in mb-8 space-y-4">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="quiz-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="quiz-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Quiz title"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="quiz-description">
                      Description
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="quiz-description"
                        placeholder="Quiz description (optional)"
                        rows={2}
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="text-xs tabular-nums">
                          {field?.value?.length}/200 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Time Limit</span>
              <Switch
                checked={timeLimitEnabled}
                onCheckedChange={() => {
                  form.setValue(
                    "timeLimitMinutes",
                    timeLimitEnabled ? null : "10"
                  )
                  setTimeLimitEnabled((enabled) => !enabled)
                }}
              />
              {timeLimitEnabled && (
                <div>
                  <Controller
                    name="timeLimitMinutes"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          type="number"
                          min={1}
                          max={180}
                          value={field.value as string}
                          id="quiz-title"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
              {timeLimitEnabled && (
                <span className="text-xs text-muted-foreground">min</span>
              )}
            </div>
          </div>

          {/* using hook form validate */}
          <div className="mb-8 space-y-6">
            {questionFields.map((questionField, qIndex) => (
              <Card key={qIndex} className="quiz-card animate-slide-in p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      Q{qIndex + 1}
                    </span>
                    <Badge variant="default">
                      {renderBadgeQuestionType(questionField.type)}
                    </Badge>
                  </div>
                  <CustomAlertDialog
                    onClick={() => removeQuestion(qIndex)}
                    title="Delete Question?"
                    description="Are you sure you want to delete this question? This action cannot be undone."
                  >
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </CustomAlertDialog>
                </div>
                <Controller
                  name={`questions.${qIndex}.prompt`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="question-prompt">Title</FieldLabel>
                      <Input
                        {...field}
                        id="question-prompt"
                        aria-invalid={fieldState.invalid}
                        placeholder="Question prompt"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {questionField.type === QuestionType.MCQ && (
                  <MCQForm
                    key={qIndex}
                    control={form.control}
                    questionIndex={qIndex}
                  />
                )}

                {questionField.type === QuestionType.ShortAnswer && (
                  <ShortQuestionForm
                    key={qIndex}
                    control={form.control}
                    questionIndex={qIndex}
                  />
                )}
              </Card>
            ))}
          </div>
        </form>

        <div className="mb-8 flex gap-3">
          <Button variant="outline" onClick={addMultipleChoice}>
            <Plus className="mr-2 h-4 w-4" /> Multiple Choice
          </Button>
          <Button variant="outline" onClick={addShortAnswer}>
            <Plus className="mr-2 h-4 w-4" /> Short Answer
          </Button>
          <Button variant="outline" onClick={addCodeQuestion}>
            <Plus className="mr-2 h-4 w-4" /> Code
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            disabled={form.formState.isSubmitting}
            type="submit"
            form="quiz-form"
          >
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
