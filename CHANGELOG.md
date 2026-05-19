# Changelog

All notable changes to this project will be documented in this file.

## v0.2.0-beta - 2026-05-19

### Added
- Response Dialog fallback when clipBo cannot paste into the focused app.
- Toggle for showing Response Dialog when no editable target is available.
- Markdown rendering, copy plain text, and copy Markdown in Response Dialog.
- Smart Action and built-in AI action enable/disable toggles.
- Settings tabs for General, Actions, Provider, and About.
- Ask by Image thumbnail preview with lightbox and retake screenshot action.
- Dock-click popup toggle behavior on macOS.

### Improved
- Chat now renders the user's message immediately before the AI reply finishes.
- First chat bubble now shows the user's real question instead of internal model prompt text.
- Ask by Image opens directly from clipboard image or ROI capture without an extra source chooser.
- Ask by Image layout is more compact and avoids overlapping controls.
- Main popup adapts height to visible actions.
- Main popup uses native macOS title bar for easier dragging.
- Provider selection UI shows only options for the active provider.
- Ollama provider handling and settings UI.

### Fixed
- Pasteback fallback no longer leaves the user wondering when the target app has no input field.
- Take new shot closes the current Ask by Image dialog before starting ROI capture.
- Large image payloads are no longer passed through the URL, avoiding Vite 431 header errors.
- Chat first-turn image context remains available while showing a cleaner user bubble.

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
