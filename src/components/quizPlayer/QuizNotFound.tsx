import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

interface QuizNotFoundProps {
  quizId?: string
  onNavigate: () => void
}

export const QuizNotFound = ({ quizId, onNavigate }: QuizNotFoundProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="quiz-card animate-fade-in w-full max-w-md p-8 text-center">
        <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-400" />
        <h2 className="mb-2 text-2xl font-bold">Quiz Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          No quiz exists with ID:{" "}
          <code className="font-mono text-primary">{quizId}</code>
        </p>
        <Button onClick={onNavigate}>Go Home</Button>
      </Card>
    </div>
  )
}
