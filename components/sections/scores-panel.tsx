import { ActionCard } from "@/components/scoring/action-card"
import { ScoreDisplay } from "@/components/scoring/score-display"
import type { Scores } from "@/types"

interface ScoresPanelProps {
  scores: Scores | null
  drawingDataUrl: string
  prompt: string
}

export function ScoresPanel({ scores, drawingDataUrl, prompt }: ScoresPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-mono font-bold text-gray-900">Your Scores</h2>
        <p className="text-sm text-gray-500 mt-1">Submit your drawing to get AI-generated scores</p>
      </div>

      <ScoreDisplay scores={scores} />

      {scores && drawingDataUrl && <ActionCard scores={scores} drawingDataUrl={drawingDataUrl} prompt={prompt} />}
    </div>
  )
}
