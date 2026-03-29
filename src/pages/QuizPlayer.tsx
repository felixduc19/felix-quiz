import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { CustomAlertDialog } from "@/components/AlertDialog"
import { Loading } from "@/components/Loading"
import { ProgressBar } from "@/components/quizPlayer/ProgressBar"
import { QuestionCard } from "@/components/quizPlayer/QuestionCard"
import { QuizNotFound } from "@/components/quizPlayer/QuizNotFound"
import { ResultsView } from "@/components/quizPlayer/ResultView"
import Timer from "@/components/Timer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSubmitAttemptMutation } from "@/hooks/mutations/useSubmitAttemptMutation"
import { useAttemptQuery } from "@/hooks/queries/useAttemptQuery"
import { useAntiCheat } from "@/hooks/useAntiCheat"
import { QuestionType } from "@/types"
import { ArrowLeft, ArrowRight, Send } from "lucide-react"

export default function QuizPlayer() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const antiCheat = useAntiCheat()

  const { data: attemptData, isLoading: isAttemptLoading } = useAttemptQuery(
    quizId!
  )

  const {
    submit,
    isSubmitting,
    data: submitAttemptData,
  } = useSubmitAttemptMutation()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestion = attemptData?.quiz?.questions[currentIndex]

  const setAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    if (!attemptData || !attemptData.id) return

    await submit({
      attemptId: attemptData.id,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        value: answer,
      })),
    })
  }

  if (isAttemptLoading) {
    return <Loading message="Loading quiz..." />
  }

  if (isSubmitting) {
    return <Loading message="Submitting your quiz..." />
  }

  if (!attemptData || !attemptData.quiz) {
    return <QuizNotFound quizId={quizId} onNavigate={() => navigate("/")} />
  }

  const { quiz } = attemptData

  const questionShouldScoreQuantity = quiz.questions.filter(
    (q) => q.type !== QuestionType.Code
  ).length

  if (submitAttemptData) {
    return (
      <ResultsView
        quiz={quiz}
        result={submitAttemptData}
        antiCheatSummary={antiCheat.getSummary()}
        yourAnswers={answers}
        questionShouldScoreQuantity={questionShouldScoreQuantity}
      />
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <CustomAlertDialog
            title="Exit Quiz?"
            description="Your progress will be lost and cannot be recovered. Are you sure you want to exit?"
            onClick={() => navigate("/")}
          >
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" /> Exit
            </Button>
          </CustomAlertDialog>

          <div className="flex items-center gap-3">
            <Timer
              timeLimitMinutes={quiz.timeLimitSeconds! / 60}
              handleTimeEnd={handleSubmit}
            />
            <Badge variant="secondary" className="font-mono">
              {currentIndex + 1} / {quiz.questions.length}
            </Badge>
          </div>
        </div>

        <h1 className="mb-1 text-2xl font-bold">{quiz.title}</h1>
        {quiz.description && (
          <p className="mb-6 text-muted-foreground">{quiz.description}</p>
        )}

        <ProgressBar
          currentIndex={currentIndex}
          quizQuestionQuantity={quiz.questions.length}
        />

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ""}
            onAnswer={(a) => setAnswer(currentQuestion.id, a)}
            onPaste={antiCheat.onPaste}
          />
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentIndex < quiz.questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <CustomAlertDialog
              title="Submit Quiz"
              description="Are you sure you want to submit? You won't be able to change your answers after submitting."
              onClick={handleSubmit}
            >
              <Button>
                Submit <Send className="ml-2 h-4 w-4" />
              </Button>
            </CustomAlertDialog>
          )}
        </div>
      </div>
    </div>
  )
}
