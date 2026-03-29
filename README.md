# FelixQuiz

A full-featured React-based quiz application for creating and taking coding-related quizzes with multiple question types, syntax-highlighted code editor, real-time progress tracking, and integrated anti-cheat monitoring.

## Features

### Quiz Creation

- **Multiple Question Types**
  - Multiple Choice Questions (MCQ) with customizable options
  - Short Answer questions with case-insensitive matching
  - Code questions with syntax highlighting
- **Quiz Management**
  - Add/remove questions dynamically
  - Set quiz title and description
  - Optional time limit (configurable in minutes)
  - Quiz publishing and sharing via unique ID
- **Form Validation** - Real-time validation using Zod schemas

### Quiz Playing

- **Question Navigation**
  - Previous/Next buttons for navigation
  - Visual progress bar showing quiz completion
  - Question counter badge
- **Timer**
  - Optional countdown timer based on quiz time limit
  - Auto-submit when time runs out
  - Visual warning when time is low (pulsing animation)
- **Question Types Support**
  - MCQ selection with visual feedback
  - Text input for short answers
  - Full code editor for code questions with language syntax highlighting

### Results & Scoring

- **Score Display**
  - Percentage score calculation
  - Detailed breakdown of correct/incorrect answers
  - Visual indicators (border colors) for question correctness
- **Answer Review**
  - View correct answers for each question
  - Code questions displayed in read-only editor
  - Anti-cheat event summary (tab switches, paste events)

### Anti-Cheat Monitoring

- **Event Tracking**
  - Tab/window blur detection
  - Tab/window focus detection
  - Paste event detection in inputs and code editor
  - ISO-8601 timestamp logging
- **Results Summary**
  - Tab switch count
  - Paste event count
  - Visual alert display on results page

## Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
VITE_API_TOKEN=your-api-token
```

## Template

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

### Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

### Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Project Structure

```
src/
├── pages/              # Main page components
│   ├── Home.tsx        # Home page with quiz entry
│   ├── QuizCreator.tsx # Quiz creation interface
│   ├── QuizPlayer.tsx  # Quiz taking interface
│   └── NotFound.tsx    # 404 page
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── quizCreator/    # Quiz creation form components
│   ├── quizPlayer/     # Quiz playing components
│   ├── CodeEditor.tsx  # Syntax-highlighted code editor
│   ├── Timer.tsx       # Quiz countdown timer
│   ├── Loading.tsx     # Loading spinner
│   └── AlertDialog.tsx # Custom alert dialog
├── hooks/
│   ├── useAntiCheat.tsx           # Anti-cheat event tracking
│   └── mutations/
│       ├── useQuizMutation.tsx    # Quiz creation mutations
│       ├── useAttemptMutation.tsx # Quiz attempt API calls
│       └── useAttemptQuery.tsx    # Quiz attempt queries
├── services/           # API service functions
│   ├── quizServices.ts
│   └── attemptServices.ts
├── schema/             # Zod validation schemas
├── types/              # TypeScript types and enums
├── lib/                # Utilities and API client
└── App.tsx             # Main app with routing
```

## API Integration

The application communicates with a backend API for:

- **Quiz Management**: Create quizzes and add questions
- **Quiz Attempts**: Start attempts, submit answers, get results
- **Authentication**: Bearer token in request headers

### API Endpoints (Expected)

```
POST   /quizzes                  # Create a new quiz
POST   /quizzes/:id/questions   # Add questions to quiz
POST   /attempts                 # Start a quiz attempt
POST   /attempts/:id/answer      # Submit an answer
POST   /attempts/:id/submit      # Submit quiz attempt
GET    /attempts/:id/events     # Get anti-cheat events
```

## Architecture Decisions & Trade-offs

| Decision                                  | Benefits                                                                                                                                  | Trade-offs                                                                                                                                                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TanStack React Query** for state        | Efficient data fetching with caching, background updates, and mutations. Separates server state from UI state clearly.                    | **Additional bundle size** (~40KB); **Learning curve** for developers unfamiliar with query management; Over-engineered if API is simple/fast                                          |
| **React Hook Form** for forms             | Lightweight form library with excellent TypeScript support and minimal re-renders. Pairs well with Zod for validation.                    | **Less opinionated** than Formik; Requires **manual integration** with some UI libraries; Smaller community than alternatives                                                          |
| **`react-simple-code-editor` + Prism.js** | Lightweight editor providing syntax highlighting for both editing and read-only display. Code stored as plain strings for easy transport. | **Limited features** vs. Monaco/CodeMirror (Line wrapping, linting, debugging); Syntax highlighting adds **runtime overhead**; Not optimized for large code snippets (>10KB)           |
| **Client-side anti-cheat monitoring**     | Simple to implement; No backend overhead; Immediate event tracking feedback.                                                              | **Easily bypassed** via DevTools; No tamper-protection; **Not suitable for high-stakes** exams; Requires server-side verification for production                                       |
| **shadcn/ui + Tailwind CSS**              | Component customization and consistency; Rapid development with utility-first styling; **No runtime cost** (CSS is compiled).             | **Large CSS output** if not properly purged (~50KB+); **Limited accessibility** out-of-box for complex components; **Mobile-first** approach may require rework for desktop-heavy apps |
| **Quiz data in memory (API-driven)**      | Simple state management; No Redux/Zustand complexity; Data automatically cleared between sessions.                                        | **No persistence** during disconnection; **Session loss** on page refresh; **Not suitable** for multi-tab quiz taking; Cannot resume partially completed quizzes                       |

### API Design: N+1 Pattern for Quiz & Attempt Creation

**Current Implementation:**

- **Quiz Creation**: Separate API calls for metadata + individual questions
  - 1 call: `POST /quizzes` (metadata)
  - N calls: `POST /quizzes/:id/questions` (one per question)
  - **Total: N+1 calls** (10 questions = 11 API calls)
- **Attempt Submission**: Separate API calls for answers + final submit
  - N calls: `POST /attempts/:id/answer` (one per answer)
  - 1 call: `POST /attempts/:id/submit` (finalize)
  - **Total: N+1 calls** (10 answers = 11 API calls)

| Aspect                  | Benefits                                                                                                                                                                                                                                             | Trade-offs                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design Pattern**      | **Modular API**—each endpoint has single responsibility; **Incremental processing**—can add/validate questions one-by-one; **Error handling per resource**—easier to retry individual questions; **Backend simplicity**—less complex payload parsing | **N+1 API calls**—network overhead accumulates; **Increased latency**—multiple round-trips increase perceived slowness; **Race conditions possible**—partial quiz creation if client crashes; **No atomicity**—failed question creates orphaned quiz metadata; **Server load**—more concurrent requests to handle |
| **Suitable For**        | Small to medium quizzes (<50 questions); Development/testing; When question validation requires async checking (e.g., uniqueness)                                                                                                                    | Not ideal for large quizzes (>100 questions); High-frequency quiz creation; Strict latency requirements; Offline-first apps                                                                                                                                                                                       |
| **Future Optimization** | Consider implementing bulk `POST /quizzes/batch` endpoint that accepts `{metadata, questions}` and returns created quiz with all questions atomically                                                                                                | Could also add progress tracking for multi-step operations; Implement request deduplication; Add client-side queuing for better UX                                                                                                                                                                                |

## Anti-Cheat Implementation

The anti-cheat system is implemented in [src/hooks/useAntiCheat.tsx](src/hooks/useAntiCheat.tsx).

### Events Tracked

| Event Type | Trigger                                 | Purpose                                |
| ---------- | --------------------------------------- | -------------------------------------- |
| `blur`     | User switches away from quiz tab/window | Detect tab switching or loss of focus  |
| `focus`    | User returns to quiz tab/window         | Track when user regains focus          |
| `paste`    | Paste in text input or code editor      | Detect copy-paste behavior during quiz |

### Implementation Details

- Events accumulate in a `useRef` array during the quiz session (no re-renders).
- Each event includes ISO-8601 timestamp.
- On quiz submission, the event summary (tab switches, paste count) is displayed on the results page.
- Full API integration ready for server-side event logging.

### Limitations

- **Client-side only** — a determined user could disable listeners via browser DevTools.
- **No tampering protection** — events aren't cryptographically signed or verified server-side.
- For production use, implement server-side validation and logging.

## Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| **UI**      | React 19, TypeScript, Vite                   |
| **Styling** | Tailwind CSS 4, shadcn/ui, CVA               |
| **Forms**   | React Hook Form, Zod                         |
| **State**   | TanStack React Query 5, React Router         |
| **Editor**  | react-simple-code-editor, Prism.js           |
| **API**     | Axios with custom interceptors               |
| **Theming** | next-themes with system preference detection |
| **Notify**  | Sonner (toast notifications)                 |

## Available Scripts

```bash
# Development
npm run dev        # Start dev server
npm run preview    # Preview production build

# Building
npm run build      # Build for production
npm run typecheck  # Run TypeScript type checking

# Code Quality
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Future Enhancements

- Quiz navigation box on quiz player screen for easy interaction with question
- User authentication system
- Export quiz results as PDF
- Quiz templates and categories
- Server-side event logging for tamper-proof anti-cheat
