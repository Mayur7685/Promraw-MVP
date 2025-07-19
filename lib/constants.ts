export const APP_CONFIG = {
  name: "Promraw",
  tagline: "AI prompts. Draw. Mint. Create.",
  version: "1.0.0",
} as const

export const DRAWING_CONFIG = {
  canvasWidth: 500,
  canvasHeight: 300,
  defaultBrushSize: 15,
  maxBrushSize: 30,
  minBrushSize: 1,
} as const

export const AI_CONFIG = {
  maxPromptLength: 200,
  scoringTimeout: 30000, // 30 seconds
} as const
