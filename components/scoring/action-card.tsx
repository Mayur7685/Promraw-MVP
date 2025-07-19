import type { Scores } from "@/types"

interface ActionCardProps {
  scores: Scores
  drawingDataUrl: string
  prompt: string
}

export function ActionCard({ scores, drawingDataUrl, prompt }: ActionCardProps) {
  const artworkName = `${prompt.split(" ").slice(0, 2).join("")}Dream`

  return (
    <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
      <h3 className="font-mono text-sm font-bold text-center mb-3">Action Card Preview</h3>
      <div className="bg-white p-3 rounded border shadow-sm">
        <img
          src={drawingDataUrl || "/placeholder.svg"}
          alt="Your drawing"
          className="w-full h-24 object-contain rounded mb-2"
        />
        <div className="text-center">
          <h4 className="font-mono text-xs font-bold">{artworkName}</h4>
          <p className="text-xs text-gray-600 mt-1 truncate">{prompt}</p>
          <div className="flex justify-around mt-2 text-xs">
            <div>
              <div className="font-bold">CRT</div>
              <div>{scores.creativity}</div>
            </div>
            <div>
              <div className="font-bold">ADH</div>
              <div>{scores.promptAdherence}</div>
            </div>
            <div>
              <div className="font-bold">ART</div>
              <div>{scores.artisticQuality}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
