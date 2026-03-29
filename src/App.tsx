import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import QuizCreator from "./pages/QuizCreator"
import QuizPlayer from "./pages/QuizPlayer"
import NotFound from "./pages/NotFound"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creator" element={<QuizCreator />} />
          <Route path="/quiz/:quizId" element={<QuizPlayer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
