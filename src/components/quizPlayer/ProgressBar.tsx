interface ProgressBarProps {
  currentIndex: number
  quizQuestionQuantity: number
}

export const ProgressBar = ({
  currentIndex,
  quizQuestionQuantity,
}: ProgressBarProps) => {
  return (
    <div className="mb-8 h-1.5 w-full rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{
          width: `${((currentIndex + 1) / quizQuestionQuantity) * 100}%`,
        }}
      />
    </div>
  )
}
