import { invoke } from "@tauri-apps/api/core"

type SettingsSnapshot = {
  settings: unknown
  smart_actions: unknown[]
  builtin_actions: unknown[]
}

type SaveSnapshotResponse = {
  ok: boolean
  error?: string
  smart_actions?: unknown[]
  builtin_actions?: unknown[]
}

type ChatApiResponse = {
  ok: boolean
  error?: string
  session?: unknown
}

type DesktopApi = {
  submitAsk: (prompt: string, responseMode?: string) => void | Promise<void>
  cancelAsk: () => void | Promise<void>
  submitPopup: (actionId: string) => void | Promise<void>
  cancelPopup: () => void | Promise<void>
  openSettings: () => void | Promise<void>
  setUiLanguage: (lang: string) => void | Promise<void>
  getSettingsSnapshot: () => Promise<SettingsSnapshot>
  saveSettingsSnapshot: (payload: string) => Promise<SaveSnapshotResponse>
  closeSettings: (saved: boolean) => void | Promise<void>
  getChatState?: () => Promise<ChatApiResponse>
  bootstrapChat: () => Promise<ChatApiResponse>
  sendChatMessage: (prompt: string) => Promise<ChatApiResponse>
  insertLatestReply: () => Promise<{ ok: boolean; error?: string }>
  closeChat: () => void | Promise<void>
  chooseImageSource: (source: string) => void | Promise<void>
  cancelImageSource: () => void | Promise<void>
}

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown
  }
}

function isTauriRuntime() {
  return typeof window !== "undefined" && Boolean(window.__TAURI_INTERNALS__)
}

function createTauriApi(): DesktopApi {
  return {
    submitAsk: (prompt, responseMode) => invoke("submit_ask", { prompt, responseMode }),
    cancelAsk: () => invoke("cancel_ask"),
    submitPopup: (actionId) => invoke("submit_popup", { actionId }),
    cancelPopup: () => invoke("cancel_popup"),
    openSettings: () => invoke("open_settings"),
    setUiLanguage: (lang) => invoke("set_ui_language", { lang }),
    getSettingsSnapshot: () => invoke<SettingsSnapshot>("get_settings_snapshot"),
    saveSettingsSnapshot: (payload) => invoke<SaveSnapshotResponse>("save_settings_snapshot", { payload }),
    closeSettings: (saved) => invoke("close_settings", { saved }),
    getChatState: () => invoke<ChatApiResponse>("bootstrap_chat"),
    bootstrapChat: () => invoke<ChatApiResponse>("bootstrap_chat"),
    sendChatMessage: (prompt) => invoke<ChatApiResponse>("send_chat_message", { prompt }),
    insertLatestReply: () => invoke<{ ok: boolean; error?: string }>("insert_latest_reply"),
    closeChat: () => invoke("close_chat"),
    chooseImageSource: (source) => invoke("choose_image_source", { source }),
    cancelImageSource: () => invoke("cancel_image_source"),
  }
}

export function installDesktopApiBridge() {
  const pywebviewWindow = window as Window & { pywebview?: { api: unknown } }
  if (!isTauriRuntime() || pywebviewWindow.pywebview?.api) {
    return
  }

  ;(pywebviewWindow as { pywebview?: { api: DesktopApi } }).pywebview = { api: createTauriApi() }
  window.dispatchEvent(new Event("pywebviewready"))
}
