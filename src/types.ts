export interface Clock {
  id: string
  model_name: string
  provider: string
  html_content: string
  time_shown: string
  generated_at: string
  generation_time_ms: number | null
}

export const MODEL_ORDER = [
  'GPT-3.5',
  'GPT-4o',
  'GPT-5',
  'Haiku 3.5',
  'Gemini 2.5',
  'DeepSeek V3.1',
  'Grok 4',
  'Qwen 2.5',
  'Kimi K2',
] as const
