import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-css"
import "prismjs/themes/prism-tomorrow.css"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  onPaste?: () => void
  readOnly?: boolean
  placeholder?: string
  language?: string
  minHeight?: string
}

const LANGUAGE_MAP: Record<string, Prism.Grammar> = {
  javascript: Prism.languages.javascript,
  js: Prism.languages.javascript,
  typescript: Prism.languages.typescript,
  ts: Prism.languages.typescript,
  python: Prism.languages.python,
  py: Prism.languages.python,
  java: Prism.languages.java,
  css: Prism.languages.css,
}

function getGrammar(language?: string): Prism.Grammar {
  if (language && LANGUAGE_MAP[language.toLowerCase()]) {
    return LANGUAGE_MAP[language.toLowerCase()]
  }
  return Prism.languages.javascript
}

function getLangKey(language?: string): string {
  const lower = language?.toLowerCase() || "javascript"
  if (["js", "javascript"].includes(lower)) return "javascript"
  if (["ts", "typescript"].includes(lower)) return "typescript"
  if (["py", "python"].includes(lower)) return "python"
  if (lower === "java") return "java"
  if (lower === "css") return "css"
  return "javascript"
}

export default function CodeEditor({
  value,
  onChange,
  onPaste,
  readOnly = false,
  placeholder = "// Write code here...",
  language = "javascript",
  minHeight = "120px",
}: CodeEditorProps) {
  const highlight = (code: string) =>
    Prism.highlight(code, getGrammar(language), getLangKey(language))

  const detectedLang = getLangKey(language)

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border"
      style={{ background: "#1d1f21" }}
    >
      <span className="absolute top-2 right-3 z-10 font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase select-none">
        {detectedLang}
      </span>
      <Editor
        value={value}
        onValueChange={onChange || (() => {})}
        highlight={highlight}
        placeholder={placeholder}
        readOnly={readOnly}
        padding={16}
        onPaste={onPaste}
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          lineHeight: 1.6,
          minHeight,
          color: "#c5c8c6",
          caretColor: "#c5c8c6",
        }}
        className={readOnly ? "pointer-events-none select-text" : ""}
        textareaClassName="focus:outline-none"
      />
    </div>
  )
}
