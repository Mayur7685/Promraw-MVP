"use client"

import type { RefObject } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { PromptBox } from "@/components/drawing/prompt-box"
import { DrawingCanvas } from "@/components/drawing/drawing-canvas"
import { MintingModal } from "@/components/minting/minting-modal"
import type { DrawingTool, Scores } from "@/types"

interface CreativeChallengeProps {
  prompt: string
  isGeneratingPrompt: boolean
  onGenerateNewPrompt: () => void
  canvasRef: RefObject<HTMLCanvasElement>
  tool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
  onClearCanvas: () => void
  onDownloadDrawing: () => void
  isScoring: boolean
  onSubmitForScoring: () => void
  scores: Scores | null
  drawingDataUrl: string
  isWalletConnected: boolean
}

export function CreativeChallenge({
  prompt,
  isGeneratingPrompt,
  onGenerateNewPrompt,
  canvasRef,
  tool,
  onToolChange,
  onClearCanvas,
  onDownloadDrawing,
  isScoring,
  onSubmitForScoring,
  scores,
  drawingDataUrl,
  isWalletConnected,
}: CreativeChallengeProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-mono font-bold text-gray-900">Creative Challenge</h2>
        <p className="text-sm text-gray-500 mt-1">Create your masterpiece based on the AI prompt</p>
      </div>

      <PromptBox prompt={prompt} isGeneratingPrompt={isGeneratingPrompt} onGenerateNewPrompt={onGenerateNewPrompt} />

      <DrawingCanvas
        canvasRef={canvasRef}
        tool={tool}
        onToolChange={onToolChange}
        onClearCanvas={onClearCanvas}
        onDownloadDrawing={onDownloadDrawing}
      />

      <Button
        onClick={onSubmitForScoring}
        disabled={isScoring}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-mono"
      >
        {isScoring ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <Sparkles className="w-4 h-4 mr-2" />
            Submit for AI Scoring
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Submit for AI Scoring
          </>
        )}
      </Button>

      {scores && (
        <MintingModal
          scores={scores}
          drawingDataUrl={drawingDataUrl}
          prompt={prompt}
          isWalletConnected={isWalletConnected}
        />
      )}
    </div>
  )
}
