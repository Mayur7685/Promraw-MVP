export interface Scores {
  creativity: number
  promptAdherence: number
  artisticQuality: number
  overall: number
}

export interface DrawingTool {
  type: "brush" | "eraser"
  color: string
  size: number
}

export interface AIPromptResponse {
  prompt: string
  id: string
  timestamp: string
}

export interface AIScoreResponse {
  creativity: number
  promptAdherence: number
  artisticQuality: number
  overall: number
  feedback?: string
}
