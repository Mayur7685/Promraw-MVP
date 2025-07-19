import type { Scores } from "@/types"

interface ScoreDisplayProps {
  scores: Scores | null
}

export function ScoreDisplay({ scores }: ScoreDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center py-2">
        <span className="font-mono text-sm text-gray-700">Creativity</span>
        <span className="font-mono text-sm text-gray-500">{scores?.creativity ?? "–"}/10</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-mono text-sm text-gray-700">Prompt Adherence</span>
        <span className="font-mono text-sm text-gray-500">{scores?.promptAdherence ?? "–"}/10</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-mono text-sm text-gray-700">Artistic Quality</span>
        <span className="font-mono text-sm text-gray-500">{scores?.artisticQuality ?? "–"}/10</span>
      </div>
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="font-mono text-base font-bold text-gray-900">Overall Score</span>
          <span className="font-mono text-lg font-bold text-gray-900">{scores?.overall ?? "–"}</span>
        </div>
      </div>
    </div>
  )
}
