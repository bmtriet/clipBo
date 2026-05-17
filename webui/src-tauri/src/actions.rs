use serde::{Deserialize, Serialize};

pub const AI_PROMPT_ID: &str = "ai_prompt";
pub const IMAGE_ASK_ID: &str = "image_ask";

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SmartAction {
    pub id: String,
    pub name: String,
    pub prompt: String,
    pub hotkey: String,
    pub return_with_source: bool,
    pub ask_before_run: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct BuiltinAction {
    pub id: String,
    pub name: String,
    pub hotkey: String,
    pub kind: String,
}

pub fn default_builtin_actions() -> Vec<BuiltinAction> {
    vec![
        BuiltinAction {
            id: AI_PROMPT_ID.to_string(),
            name: "AI Prompt".to_string(),
            hotkey: "a".to_string(),
            kind: AI_PROMPT_ID.to_string(),
        },
        BuiltinAction {
            id: IMAGE_ASK_ID.to_string(),
            name: "Ask by Image".to_string(),
            hotkey: "i".to_string(),
            kind: IMAGE_ASK_ID.to_string(),
        },
    ]
}

pub fn default_smart_actions() -> Vec<SmartAction> {
    vec![
        SmartAction {
            id: "add-vietnamese-marks".to_string(),
            name: "Thêm dấu tiếng Việt".to_string(),
            prompt: "Bạn là chuyên gia tiếng Việt. Hãy thêm dấu chuẩn xác nhất cho đoạn văn bản được cung cấp. Chỉ trả về văn bản đã thêm dấu, không giải thích, không thêm bình luận.".to_string(),
            hotkey: "1".to_string(),
            return_with_source: false,
            ask_before_run: false,
        },
        SmartAction {
            id: "translate-to-english".to_string(),
            name: "Translate to English".to_string(),
            prompt: "Translate the provided text into natural English. Return only the translated text. Do not explain your answer.".to_string(),
            hotkey: "e".to_string(),
            return_with_source: false,
            ask_before_run: false,
        },
        SmartAction {
            id: "translate-to-vietnamese".to_string(),
            name: "Translate to Vietnamese".to_string(),
            prompt: "Hãy dịch đoạn văn bản được cung cấp sang tiếng Việt tự nhiên. Chỉ trả về bản dịch, không giải thích.".to_string(),
            hotkey: "v".to_string(),
            return_with_source: false,
            ask_before_run: false,
        },
        SmartAction {
            id: "translate-to-zh-tw".to_string(),
            name: "Translate to Traditional Chinese".to_string(),
            prompt: "Translate the provided text into Traditional Chinese used in Taiwan. Return only the translated text without explanations.".to_string(),
            hotkey: "z".to_string(),
            return_with_source: false,
            ask_before_run: false,
        },
        SmartAction {
            id: "translate-to-khmer".to_string(),
            name: "Translate to Khmer".to_string(),
            prompt: "Translate the provided text into natural Khmer. Return only the translated text without explanations.".to_string(),
            hotkey: "k".to_string(),
            return_with_source: false,
            ask_before_run: false,
        },
    ]
}
