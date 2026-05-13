import { useEffect, useState, useRef } from "react"
import { Send, X, MessageCircle, Type, Languages, Globe, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

declare global {
  interface Window {
    pywebview?: {
      api: {
        submitQa: (prompt: string, lang: string, length: string, appendQuestion: boolean) => void;
        cancelQa: () => void;
        submitPopup: (action: string, targetLang: string) => void;
        cancelPopup: () => void;
        setUiLanguage: (lang: string) => void;
      }
    }
  }
}

const translations = {
  en: {
    qaTitle: "AI Prompt",
    qaPlaceholder: "Enter your question or request (Press Enter to send)...",
    qaLangLabel: "Response Language:",
    qaLengthLabel: "Length:",
    qaShort: "Short",
    qaMedium: "Medium",
    qaDetailed: "Detailed",
    qaAppendQ: "Append Question",
    qaCancel: "Cancel (ESC)",
    qaSend: "Quick Send",
    popupTitle: "Select Feature",
    popupSubtitle: "KoDauKoVui Assistant",
    popupFooter: "Press 1–6 for quick select, or ESC to cancel.",
    opt1: "Add Vietnamese Marks",
    opt2: "Translate to English",
    opt3: "Translate to Traditional Chinese",
    opt4: "Translate to Khmer",
    opt5: "Translate to Vietnamese",
    opt6: "AI Prompt",
    flagEn: "🇬🇧 EN",
    flagVi: "🇻🇳 VI",
    flagZh: "🇹🇼 ZH"
  },
  vi: {
    qaTitle: "Hỏi đáp AI (Prompt)",
    qaPlaceholder: "Nhập câu hỏi hoặc yêu cầu của bạn (Bấm Enter để gửi)...",
    qaLangLabel: "Ngôn ngữ trả lời:",
    qaLengthLabel: "Độ dài:",
    qaShort: "Ngắn gọn",
    qaMedium: "Trung bình",
    qaDetailed: "Chi tiết",
    qaAppendQ: "Đính kèm câu hỏi",
    qaCancel: "Hủy (ESC)",
    qaSend: "Gửi nhanh",
    popupTitle: "Chọn chức năng",
    popupSubtitle: "KoDauKoVui Assistant",
    popupFooter: "Bấm phím 1–6 để chọn nhanh, hoặc ESC để hủy.",
    opt1: "Thêm dấu tiếng Việt",
    opt2: "Dịch sang Tiếng Anh",
    opt3: "Dịch sang Tiếng Hoa Phồn thể",
    opt4: "Dịch sang Tiếng Khmer",
    opt5: "Dịch sang Tiếng Việt",
    opt6: "Hỏi đáp AI",
    flagEn: "🇬🇧 EN",
    flagVi: "🇻🇳 VI",
    flagZh: "🇹🇼 ZH"
  },
  zh: {
    qaTitle: "AI 问答",
    qaPlaceholder: "输入您的问题或要求（按回车发送）...",
    qaLangLabel: "回答语言:",
    qaLengthLabel: "长度:",
    qaShort: "精简",
    qaMedium: "中等",
    qaDetailed: "详细",
    qaAppendQ: "附带问题",
    qaCancel: "取消 (ESC)",
    qaSend: "快速发送",
    popupTitle: "选择功能",
    popupSubtitle: "KoDauKoVui 助手",
    popupFooter: "按 1-6 键快速选择，或按 ESC 取消。",
    opt1: "添加越南语声调",
    opt2: "翻译成英文",
    opt3: "翻译成繁体中文",
    opt4: "翻译成高棉语",
    opt5: "翻译成越南语",
    opt6: "AI 问答",
    flagEn: "🇬🇧 EN",
    flagVi: "🇻🇳 VI",
    flagZh: "🇹🇼 ZH"
  }
}

interface UiProps {
  t: any;
  lang: string;
  changeLang: (newLang: string) => void;
}

function QaUi({ t, lang: uiLang, changeLang }: UiProps) {
  const [prompt, setPrompt] = useState("")
  const [lang, setLang] = useState("Auto")
  const [length, setLength] = useState("medium")
  const [appendQuestion, setAppendQuestion] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.pywebview?.api.cancelQa()
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        submit()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prompt, lang, length, appendQuestion])

  const submit = () => {
    window.pywebview?.api.submitQa(prompt.trim(), lang, length, appendQuestion)
  }

  const langOptions = ["Auto", "VI", "EN", "ZH-tw"]
  const lengthOptions = [
    { id: "short", label: t.qaShort },
    { id: "medium", label: t.qaMedium },
    { id: "detailed", label: t.qaDetailed }
  ]

  return (
    <div className="flex flex-col h-screen bg-slate-50/95 backdrop-blur-md text-slate-900 p-4 font-sans overflow-hidden rounded-xl border border-slate-200/50 shadow-2xl">
      <div className="pywebview-drag-region flex items-center justify-between mb-3 px-1 cursor-move">
        <h2 className="text-sm font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          {t.qaTitle}
        </h2>
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 bg-slate-200/50 p-0.5 rounded-md mr-2">
            {["en", "vi", "zh"].map((l) => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-all ${
                  uiLang === l ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {l === "en" ? "🇬🇧" : l === "vi" ? "🇻🇳" : "🇹🇼"}
              </button>
            ))}
          </div>
          <button onClick={() => window.pywebview?.api.cancelQa()} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-grow relative mb-3">
        <Textarea 
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.qaPlaceholder}
          className="w-full h-full resize-none bg-white border-slate-200 focus-visible:ring-teal-500 focus-visible:border-teal-500 text-sm p-3 shadow-inner rounded-lg"
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-400 select-none bg-white/80 px-1 rounded">
          {prompt.length}/2000
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-1">{t.qaLangLabel}</label>
            <div className="flex p-1 bg-slate-200/50 rounded-lg">
              {langOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setLang(opt)}
                  className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-all font-medium ${
                    lang === opt 
                      ? "bg-white text-teal-700 shadow-sm ring-1 ring-teal-200" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {opt === "Auto" ? "🌐 Auto" : opt === "VI" ? "🇻🇳 VI" : opt === "EN" ? "🇬🇧 EN" : "🇹🇼 ZH"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-1">{t.qaLengthLabel}</label>
            <div className="flex p-1 bg-slate-200/50 rounded-lg">
              {lengthOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLength(opt.id)}
                  className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-all font-medium ${
                    length === opt.id 
                      ? "bg-white text-teal-700 shadow-sm ring-1 ring-teal-200" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={appendQuestion}
                onChange={(e) => setAppendQuestion(e.target.checked)}
              />
              <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-teal-500"></div>
            </div>
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition-colors select-none">{t.qaAppendQ}</span>
          </label>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.pywebview?.api.cancelQa()} className="border-slate-200 hover:bg-slate-100 text-xs h-8 px-3">
              {t.qaCancel}
            </Button>
            <Button onClick={submit} className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-xs h-8 px-4 shadow-md transition-all hover:shadow-lg">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {t.qaSend}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PopupUi({ t, lang: uiLang, changeLang }: UiProps) {
  const POPUP_OPTIONS = [
    { num: "1", label: t.opt1, icon: Type, action: "add_marks", color: "text-blue-600", bg: "bg-blue-50" },
    { num: "2", label: t.opt2, icon: Languages, action: "trans_en", color: "text-green-600", bg: "bg-green-50" },
    { num: "3", label: t.opt3, icon: Globe, action: "trans_zhtw", color: "text-orange-600", bg: "bg-orange-50" },
    { num: "4", label: t.opt4, icon: Globe, action: "trans_khmer", color: "text-purple-600", bg: "bg-purple-50" },
    { num: "5", label: t.opt5, icon: Globe, action: "trans_vi", color: "text-red-600", bg: "bg-red-50" },
    { num: "6", label: t.opt6, icon: MessageCircle, action: "qa", color: "text-teal-600", bg: "bg-teal-50" },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.pywebview?.api.cancelPopup()
      }
      const opt = POPUP_OPTIONS.find(o => o.num === e.key)
      if (opt) {
        window.pywebview?.api.submitPopup(opt.action, "")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-50/95 backdrop-blur-md font-sans select-none border border-slate-200/50 shadow-2xl rounded-xl overflow-hidden">
      <div className="pywebview-drag-region flex items-center p-4 bg-white/50 border-b border-slate-200/50 cursor-move">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center mr-3 shadow-inner">
          <Sparkles className="w-4 h-4 text-teal-600" />
        </div>
        <div className="flex-grow">
          <h2 className="text-sm font-bold text-slate-800">{t.popupTitle}</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{t.popupSubtitle}</p>
        </div>
        <button onClick={() => window.pywebview?.api.cancelPopup()} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex px-3 pt-3 gap-2 justify-center">
        <button 
          onClick={() => changeLang("en")} 
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white border transition-all shadow-sm group ${
            uiLang === "en" ? "border-teal-500 bg-teal-50/50 text-teal-700" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🇬🇧</span>
          <span className={`text-[10px] font-bold uppercase ${uiLang === "en" ? "text-teal-600" : "text-slate-500"}`}>English</span>
        </button>
        <button 
          onClick={() => changeLang("vi")} 
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white border transition-all shadow-sm group ${
            uiLang === "vi" ? "border-teal-500 bg-teal-50/50 text-teal-700" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🇻🇳</span>
          <span className={`text-[10px] font-bold uppercase ${uiLang === "vi" ? "text-teal-600" : "text-slate-500"}`}>Tiếng Việt</span>
        </button>
        <button 
          onClick={() => changeLang("zh")} 
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white border transition-all shadow-sm group ${
            uiLang === "zh" ? "border-teal-500 bg-teal-50/50 text-teal-700" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🇹🇼</span>
          <span className={`text-[10px] font-bold uppercase ${uiLang === "zh" ? "text-teal-600" : "text-slate-500"}`}>中文</span>
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto py-2 px-2 bg-transparent">
        {POPUP_OPTIONS.map((opt) => (
          <div 
            key={opt.num}
            onClick={() => window.pywebview?.api.submitPopup(opt.action, "")}
            className="flex items-center px-3 py-2.5 mb-1 rounded-lg hover:bg-white cursor-pointer transition-all group hover:shadow-sm border border-transparent hover:border-slate-200/50"
          >
            <div className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-200 text-slate-500 font-bold text-xs mr-3 shadow-sm group-hover:border-teal-300 group-hover:text-teal-600 transition-colors">
              {opt.num}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${opt.bg}`}>
              <opt.icon className={`w-4 h-4 ${opt.color}`} />
            </div>
            <span className="flex-grow text-sm font-medium text-slate-700 group-hover:text-slate-900">{opt.label}</span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transform group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-slate-100/50 border-t border-slate-200/50 text-center">
        <p className="text-[11px] text-slate-500 font-medium">{t.popupFooter}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState("qa")
  const [lang, setLang] = useState("en")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("page") === "popup") {
      setPage("popup")
    }
    const initialLang = params.get("uilang") || "en"
    if (["en", "vi", "zh"].includes(initialLang.toLowerCase())) {
      setLang(initialLang.toLowerCase())
    }
  }, [])

  const changeLang = (newLang: string) => {
    setLang(newLang)
    window.pywebview?.api.setUiLanguage(newLang)
  }

  const t = lang === "vi" ? translations.vi : lang === "zh" ? translations.zh : translations.en;

  if (page === "popup") return <PopupUi t={t} lang={lang} changeLang={changeLang} />
  return <QaUi t={t} lang={lang} changeLang={changeLang} />
}
