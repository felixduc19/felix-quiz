import { useEffect, useRef, useCallback } from "react"
import type { AntiCheatEvent } from "@/types"

export function useAntiCheat() {
  const events = useRef<AntiCheatEvent[]>([])

  const addEvent = useCallback((type: AntiCheatEvent["type"]) => {
    events.current.push({ type, timestamp: new Date().toISOString() })
  }, [])

  useEffect(() => {
    const onBlur = () => addEvent("blur")
    const onFocus = () => addEvent("focus")

    window.addEventListener("blur", onBlur)
    window.addEventListener("focus", onFocus)

    return () => {
      window.removeEventListener("blur", onBlur)
      window.removeEventListener("focus", onFocus)
    }
  }, [addEvent])

  const onPaste = useCallback(() => {
    addEvent("paste")
  }, [addEvent])

  const getEvents = useCallback(() => [...events.current], [])

  const getSummary = useCallback(() => {
    const e = events.current
    return {
      tabSwitches: e.filter((ev) => ev.type === "blur").length,
      pastes: e.filter((ev) => ev.type === "paste").length,
    }
  }, [])

  const reset = useCallback(() => {
    events.current = []
  }, [])

  return { onPaste, getEvents, getSummary, reset }
}
