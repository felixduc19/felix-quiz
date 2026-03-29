import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  const handleNavigateHome = () => {
    navigate("/")
  }
  return (
    <div className="mx-auto flex min-h-dvh flex-col items-center justify-center gap-8 p-8 md:gap-12 md:p-16">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
        <p>Oops! The page you're trying to access doesn't exist.</p>
        <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
          <Button className="cursor-pointer" onClick={handleNavigateHome}>
            <span>Go Back Home</span>
            <ArrowRight className="size-4"></ArrowRight>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
