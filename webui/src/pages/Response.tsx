import { useMemo, useState } from "react"
import { Check, Copy, FileText, X } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { markdownToPlainText } from "../markdown"
import { parsePayload } from "../types"
import type { EnTranslations } from "../i18n"

type ResponsePayload = {
  title?: string
  content?: string
  source?: string
  loading?: boolean
}

export function ResponsePage({ t }: { t: EnTranslations }) {
  const payload = useMemo(() => parsePayload<ResponsePayload>(), [])
  const [copied, setCopied] = useState<"plain" | "markdown" | "">("")
  const title = payload.title || t.responseDialogTitle
  const content = payload.content || ""
  const source = payload.source || ""
  const isLoading = payload.loading || false

  const copyText = async (mode: "plain" | "markdown") => {
    const text = mode === "plain" ? markdownToPlainText(content) : content
    const response = await window.desktopApi?.copyResponseText(text)
    if (response?.ok) {
      setCopied(mode)
      window.setTimeout(() => setCopied((prev) => (prev === mode ? "" : prev)), 1200)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <div data-tauri-drag-region className="desktop-drag-region flex h-5 cursor-move items-center justify-center border-b border-slate-100 bg-slate-50">
        <span className="h-1 w-12 rounded-full bg-slate-300" />
      </div>
      <div data-tauri-drag-region className="desktop-drag-region flex cursor-move select-none items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div data-tauri-drag-region className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900">{title}</h2>
          {source ? <p className="truncate text-xs text-slate-500">{source}</p> : null}
        </div>
        <button
          aria-label={t.close}
          onClick={() => window.desktopApi?.closeResponse()}
          data-tauri-drag-region={false}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500 [animation-delay:0ms]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500 [animation-delay:150ms]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-500 [animation-delay:300ms]" />
              </div>
              <p className="text-sm font-medium">{t.appLoading}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm [&_a]:text-teal-700 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-slate-100 [&_pre]:p-3">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
        <Button variant="outline" onClick={() => window.desktopApi?.closeResponse()}>
          {t.close}
        </Button>
        {!isLoading ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => void copyText("markdown")}>
              {copied === "markdown" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <FileText className="mr-1.5 h-3.5 w-3.5" />}
              {t.copyMarkdown}
            </Button>
            <Button onClick={() => void copyText("plain")} className="bg-teal-600 text-white hover:bg-teal-700">
              {copied === "plain" ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
              {copied === "plain" ? t.copied : t.copy}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
