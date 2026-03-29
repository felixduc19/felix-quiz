import { Spinner } from "./ui/spinner"

export function Loading({ message }: { message?: string }) {
  return (
    <div className="flex h-dvh items-center justify-center gap-4">
      <Spinner className="size-8" />
      {message && <p>{message}</p>}
    </div>
  )
}
