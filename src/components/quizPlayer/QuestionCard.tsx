import { QuestionType, type QuestionResponse } from "@/types"
import CodeEditor from "../CodeEditor"
import { Card } from "../ui/card"
import { Input } from "../ui/input"

interface QuestionCardProps {
  question: QuestionResponse
  answer: string
  onAnswer: (a: string) => void
  onPaste: () => void
}

export const QuestionCard = ({
  question,
  answer,
  onAnswer,
  onPaste,
}: QuestionCardProps) => {
  return (
    <Card className="quiz-card animate-fade-in p-6">
      <p className="mb-4 text-lg font-medium">{question.prompt}</p>

      {question.type === QuestionType.MCQ && (
        <div className="space-y-2">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              type="button"
              onClick={() => onAnswer(index.toString())}
              className={`w-full rounded-lg border p-3 text-left transition-all ${
                answer === index.toString()
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>
      )}

      {question.type === QuestionType.ShortAnswer && (
        <Input
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          onPaste={onPaste}
          className="font-mono"
        />
      )}

      {question.type === QuestionType.Code && (
        <CodeEditor
          value={answer}
          onChange={(val) => onAnswer(val)}
          onPaste={onPaste}
          placeholder="Write your code here..."
        />
      )}
    </Card>
  )
}
