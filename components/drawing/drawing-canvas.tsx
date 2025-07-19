import type { RefObject } from "react"
import { DrawingToolbar } from "@/components/drawing/drawing-toolbar"
import { BrushSettings } from "@/components/drawing/brush-settings"
import { Canvas } from "@/components/drawing/canvas"
import type { DrawingTool } from "@/types"

interface DrawingCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>
  tool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
  onClearCanvas: () => void
  onDownloadDrawing: () => void
}

export function DrawingCanvas({ canvasRef, tool, onToolChange, onClearCanvas, onDownloadDrawing }: DrawingCanvasProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <DrawingToolbar
        tool={tool}
        onToolChange={onToolChange}
        onClearCanvas={onClearCanvas}
        onDownloadDrawing={onDownloadDrawing}
      />

      <BrushSettings tool={tool} onToolChange={onToolChange} />

      <Canvas canvasRef={canvasRef} tool={tool} />
    </div>
  )
}
