import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { CustomAlertDialog } from "@/components/AlertDialog"
import { Loading } from "@/components/Loading"
import QuizNavigator from "@/components/QuizNavigator"
import { ProgressBar } from "@/components/quizPlayer/ProgressBar"
import { QuestionCard } from "@/components/quizPlayer/QuestionCard"
import { QuizNotFound } from "@/components/quizPlayer/QuizNotFound"
import { ResultsView } from "@/components/quizPlayer/ResultView"
import { Button } from "@/components/ui/button"
import { useSubmitAttemptMutation } from "@/hooks/mutations/useSubmitAttemptMutation"
import { useAttemptQuery } from "@/hooks/queries/useAttemptQuery"
import { useAntiCheat } from "@/hooks/useAntiCheat"
import { QuestionType } from "@/types"
import { ArrowLeft, ArrowRight, Flag, Send } from "lucide-react"

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
  const [flags, setFlags] = useState<Record<string, boolean>>({})

  const setAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleFlagQuestion = (questionId: number) => {
    setFlags((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
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

  const currentQuestion = attemptData.quiz.questions[currentIndex]

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
      <div className="mx-auto flex max-w-5xl gap-6">
        <div className="flex flex-col items-start gap-6">
          <CustomAlertDialog
            title="Exit Quiz?"
            description="Your progress will be lost and cannot be recovered. Are you sure you want to exit?"
            onClick={() => navigate("/")}
          >
            <Button variant="ghost">
              <ArrowLeft className="mr-1 h-4 w-4" /> Exit
            </Button>
          </CustomAlertDialog>
          <div className="mt-4">
            <QuizNavigator
              questions={quiz.questions}
              currentIndex={currentIndex}
              answers={answers}
              onNavigate={setCurrentIndex}
              timeLimitMinutes={quiz.timeLimitSeconds! / 60}
              handleTimeEnd={handleSubmit}
              flagQuestions={flags}
            />
          </div>

          <CustomAlertDialog
            title="Submit Quiz"
            description="Are you sure you want to submit? You won't be able to change your answers after submitting."
            onClick={handleSubmit}
            alertDialogTriggerClassName="w-full"
          >
            <Button className="w-full">
              Submit <Send className="ml-1 h-4 w-4" />
            </Button>
          </CustomAlertDialog>
        </div>

        <div className="max-w-2xl flex-1">
          <div className="flex justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold">{quiz.title}</h1>
              {quiz.description && (
                <p className="mb-6 text-muted-foreground">{quiz.description}</p>
              )}
            </div>

            <div>
              {flags?.[currentQuestion.id] ? (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleFlagQuestion(currentQuestion.id)}
                >
                  Flagged <Flag className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleFlagQuestion(currentQuestion.id)}
                >
                  Flag <Flag className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <ProgressBar
            currentIndex={
              quiz.questions.filter((q) => answers[q.id]?.trim()).length
            }
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

            <Button
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === quiz.questions.length - 1}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
