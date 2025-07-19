"use client"

import type { RefObject } from "react"
import { useCanvasDrawing } from "@/hooks/use-canvas-drawing"
import type { DrawingTool } from "@/types"

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>
  tool: DrawingTool
}

export function Canvas({ canvasRef, tool }: CanvasProps) {
  const { startDrawing, draw, stopDrawing } = useCanvasDrawing(canvasRef, tool)

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={300}
      className="w-full h-64 bg-white border border-gray-200 rounded cursor-crosshair mx-auto block"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  )
}
