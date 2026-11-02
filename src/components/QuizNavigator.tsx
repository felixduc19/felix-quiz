import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { QuestionResponse } from "@/types"
import Timer from "./Timer"

interface QuizNavigatorProps {
  questions: QuestionResponse[]
  currentIndex: number
  answers: Record<string, string>
  onNavigate: (index: number) => void
  timeLimitMinutes: number
  handleTimeEnd: () => void
  flagQuestions: Record<string, boolean>
}

export default function QuizNavigator({
  questions,
  currentIndex,
  answers,
  onNavigate,
  timeLimitMinutes,
  handleTimeEnd,
  flagQuestions,
}: QuizNavigatorProps) {
  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length

  return (
    <Card className="quiz-card animate-fade-in p-4">
      {/* Timer */}
      <Timer
        timeLimitMinutes={timeLimitMinutes}
        handleTimeEnd={handleTimeEnd}
      />

      {/* Progress summary */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Questions
        </span>
        <Badge variant="secondary" className="font-mono text-xs">
          {answeredCount}/{questions.length}
        </Badge>
      </div>

      {/* Question grid */}
      <div className="mb-4 grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.id]?.trim()
          const isCurrent = i === currentIndex
          const isFlagged = flagQuestions?.[q.id]

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onNavigate(i)}
              className={`aspect-square w-full rounded-lg border font-mono text-sm font-semibold transition-all ${
                isCurrent
                  ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : isAnswered
                    ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                    : isFlagged
                      ? "border-amber-100 bg-amber-300 text-white ring-2 ring-amber-100"
                      : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-primary/40 bg-primary/10" />
          Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-border bg-card" />
          Unanswered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-amber-300 bg-amber-200" />
          Flag
        </span>
      </div>
    </Card>
  )
}
