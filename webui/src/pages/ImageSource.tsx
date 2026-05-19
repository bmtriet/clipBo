import { useState } from "react"
import { Check, Clipboard, Crop, Image, X } from "lucide-react"
import { LanguagePills } from "../components/LanguagePills"
import type { UiLanguage, ImageSourcePayload } from "../types"
import { parsePayload } from "../types"
import type { EnTranslations } from "../i18n"

export function ImageSourcePage({
  t,
  uiLang,
  changeLang,
}: {
  t: EnTranslations
  uiLang: UiLanguage
  changeLang: (newLang: UiLanguage) => void
}) {
  const payload = parsePayload<ImageSourcePayload>()
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)

  const submit = (source: "clipboard" | "roi") => {
    window.desktopApi?.chooseImageSource(source, doNotAskAgain)
  }

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-slate-900">
      <div className="desktop-drag-region flex h-5 cursor-move items-center justify-center border-b border-slate-100 bg-slate-50">
        <span className="h-1 w-12 rounded-full bg-slate-300" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
        <div className="desktop-drag-region flex cursor-move items-center justify-between border-b border-slate-200/80 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
              <Image className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-800">{payload.title || t.imageSourceTitle}</h1>
              <p className="text-xs text-slate-500">{t.imageSourceSubtitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <LanguagePills currentLang={uiLang} onChange={changeLang} />
            <button
              onClick={() => window.desktopApi?.cancelImageSource()}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 py-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
              <Clipboard className="h-5 w-5" />
            </div>
            <h2 className="min-w-0 truncate text-base font-bold tracking-tight text-slate-800">{t.imageSourceHeadline}</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => submit("clipboard")}
              className="group flex min-h-28 items-center gap-4 rounded-lg border border-teal-200 bg-white px-4 py-4 text-left transition hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100 group-hover:bg-teal-100">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-teal-700">{t.imageSourceClipboardTitle}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500">{t.imageSourceClipboardBody}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => submit("roi")}
              className="group flex min-h-28 items-center gap-4 rounded-lg border border-sky-200 bg-white px-4 py-4 text-left transition hover:border-sky-300 hover:bg-sky-50/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-100 group-hover:bg-sky-100">
                <Crop className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-sky-700">{t.imageSourceRoiTitle}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500">{t.imageSourceRoiBody}</div>
              </div>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-4">
            <label
              className="flex cursor-pointer select-none items-center gap-3 text-sm text-slate-700"
              onClick={() => setDoNotAskAgain(!doNotAskAgain)}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${doNotAskAgain ? "border-teal-500 bg-teal-500 text-white" : "border-slate-300 bg-white"}`}>
                {doNotAskAgain ? <Check className="h-4 w-4" /> : null}
              </span>
              {t.imageSourceDoNotAsk}
            </label>
            <button
              type="button"
              onClick={() => window.desktopApi?.cancelImageSource()}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
