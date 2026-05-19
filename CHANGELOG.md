# Changelog

All notable changes to this project will be documented in this file.

## v0.1-beta - 2026-05-19

### Added
- Initial public beta release for macOS.
- Popup launcher with quick actions and AI tools.
- Chat UI with markdown rendering, copy, and copy-plain options.
- Ask by Image flow with image-source selection and thumbnail preview in chat.
- Provider support for Gemini, OpenAI-compatible APIs, and Ollama.
- About dialog with author and contact links.
- Multi-language UI (Vietnamese, English, Chinese).

### Improved
- Enter submits chat / Shift+Enter inserts newline.
- Popup hotkey can be captured directly from keyboard in Settings.
- Popup hotkey rebinds immediately after saving settings.
- Popup shows active provider and active popup shortcut pill.
- Window drag behavior improved on popup header.

### Fixed
- Settings window loading issues in packaged build.
- Duplicate Settings dialog opening from popup.
- Startup permission flow no longer opens Accessibility Settings repeatedly.
