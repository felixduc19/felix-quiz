import { Clock } from "lucide-react"
import { Badge } from "./ui/badge"
import { useEffect, useRef, useState } from "react"

const Timer = ({
  timeLimitMinutes,
  handleTimeEnd,
}: {
  timeLimitMinutes: number
  handleTimeEnd: () => void
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const hasAutoSubmitted = useRef(false)

  // Initialize timer
  useEffect(() => {
    if (timeLimitMinutes) {
      setSecondsLeft(timeLimitMinutes * 60)
    }
  }, [timeLimitMinutes])

  // Countdown
  useEffect(() => {
    if (secondsLeft === null) return
    if (secondsLeft <= 0 && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true
      handleTimeEnd()
      return
    }
    const timer = setInterval(
      () => setSecondsLeft((s) => (s !== null ? s - 1 : null)),
      1000
    )
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])
  return (
    <div className="flex items-center gap-3">
      {secondsLeft !== null && (
        <Badge
          variant="secondary"
          className={`flex items-center gap-1 font-mono ${secondsLeft <= 60 ? "animate-pulse text-destructive" : ""}`}
        >
          <Clock className="h-3 w-3" />
          {Math.floor(secondsLeft / 60)}:
          {String(secondsLeft % 60).padStart(2, "0")}
        </Badge>
      )}
    </div>
  )
}

export default Timer
