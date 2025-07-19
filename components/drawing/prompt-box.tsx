"use client"

import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

interface PromptBoxProps {
  prompt: string
  isGeneratingPrompt: boolean
  onGenerateNewPrompt: () => void
}

export function PromptBox({ prompt, isGeneratingPrompt, onGenerateNewPrompt }: PromptBoxProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white text-xs px-2 py-1 rounded font-mono">🤖 AI-Generated</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateNewPrompt}
          disabled={isGeneratingPrompt}
          className="text-xs font-mono"
        >
          {isGeneratingPrompt ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3 mr-1" />
          )}
          New Prompt
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <div className="w-4 h-4 bg-orange-400 rounded-sm flex-shrink-0 mt-0.5"></div>
        <p className="font-mono text-sm text-gray-700">{prompt}</p>
      </div>
      <p className="text-xs text-gray-400 font-mono mt-2">Generated: 6/26/2025, 11:05:05 AM</p>
    </div>
  )
}
