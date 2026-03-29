import {
  type QuizResponse,
  type AttemptResultResponse,
  QuestionType,
} from "@/types"
import { AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CodeEditor from "../CodeEditor"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultsViewProps {
  quiz: QuizResponse
  yourAnswers: Record<string, string>
  result: AttemptResultResponse
  antiCheatSummary: { tabSwitches: number; pastes: number }
  questionShouldScoreQuantity: number
}

export const ResultsView = ({
  quiz,
  yourAnswers,
  result,
  antiCheatSummary,
  questionShouldScoreQuantity,
}: ResultsViewProps) => {
  const navigate = useNavigate()

  const percentage = Math.round(
    (result.score / questionShouldScoreQuantity) * 100
  )

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="animate-fade-in mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Results</h1>
          <div className="my-4 text-6xl font-bold text-primary">
            {percentage}%
          </div>
          <p className="text-muted-foreground">
            {result.score} out of {questionShouldScoreQuantity} correct
          </p>
        </div>
        {(antiCheatSummary.tabSwitches > 0 || antiCheatSummary.pastes > 0) && (
          <Card className="quiz-card animate-fade-in mb-6 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold">Anti-Cheat Summary</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                {antiCheatSummary.tabSwitches} tab switch
                {antiCheatSummary.tabSwitches !== 1 ? "es" : ""}
              </span>
              <span>
                {antiCheatSummary.pastes} paste
                {antiCheatSummary.pastes !== 1 ? "s" : ""}
              </span>
            </div>
          </Card>
        )}
        <div className="mb-8 space-y-3">
          {result.details.map((questionResult, i) => {
            const question = quiz.questions.find(
              (q) => q.id === questionResult.questionId
            )

            const isCodingQuestion = question?.type === QuestionType.Code
            const isCorrect = questionResult.correct && !isCodingQuestion

            return (
              <Card
                key={questionResult.questionId}
                className={`animate-slide-in border-l-4 p-4 ${
                  isCodingQuestion
                    ? "border-l-blue-500"
                    : isCorrect
                      ? "border-l-green-500"
                      : "border-l-destructive"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium">
                      <span className="mr-2 font-mono text-muted-foreground">
                        Q{i + 1}
                      </span>
                      {question?.prompt}
                    </p>
                    {isCodingQuestion && (
                      <div className="mt-3">
                        <CodeEditor
                          value={yourAnswers[questionResult.questionId] || ""}
                          readOnly
                          placeholder="Empty"
                        />
                      </div>
                    )}

                    {!isCodingQuestion && (
                      <p className="text-success mt-1 text-xs">
                        Correct:{" "}
                        <span className="font-mono">
                          {questionResult.expected}
                        </span>
                      </p>
                    )}
                  </div>
                  {!isCodingQuestion && (
                    <Badge
                      variant={isCorrect ? "secondary" : "destructive"}
                      className={isCorrect ? "bg-green-200 text-green-600" : ""}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </Badge>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
