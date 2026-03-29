export enum QuestionType {
  MCQ = "mcq",
  ShortAnswer = "short",
  Code = "code",
}

export interface Choice {
  text: string
}

export interface MultipleChoiceQuestion {
  prompt: string
  position: number
  type: QuestionType.MCQ
  options: string[]
  correctAnswer: string
}

export interface ShortAnswerQuestion {
  prompt: string
  position: number
  type: QuestionType.ShortAnswer
  correctAnswer: string
}

export interface CodeQuestion {
  prompt: string
  position: number
  type: QuestionType.Code
}

export type Question =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | CodeQuestion

export interface QuestionResponse {
  id: number
  type: QuestionType
  prompt: string
  options: string[]
  position: number
}

export interface Quiz {
  title: string
  description: string
  timeLimitSeconds: number | null
  isPublished: boolean
}

export interface QuizSubmission {
  quiz: Quiz
  questions: Question[]
}

export interface QuizResponse {
  id: number
  title: string
  description: string
  timeLimitSeconds: number | null
  isPublished: boolean
  questions: QuestionResponse[]
}

export interface QuizAnswer {
  questionId: number
  value: string // choiceId for MC, text for short-answer
}

export interface AntiCheatEvent {
  type: "blur" | "focus" | "paste"
  timestamp: string
}

export interface AttemptInfoResponse {
  id: number
  quizId: string
  submittedAt: null
  answers: []
  quiz: QuizResponse
}

export interface QuestionResult {
  questionId: number
  correct: boolean
  expected: string
}

export interface AttemptResultResponse {
  score: number
  details: QuestionResult[]
}
