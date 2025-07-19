"use client"

import { Button } from "@/components/ui/button"
import { Brush, Eraser, Undo2, Redo2, Trash2, Download, Circle, Square, Triangle, Minus } from "lucide-react"
import type { DrawingTool } from "@/types"

interface DrawingToolbarProps {
  tool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
  onClearCanvas: () => void
  onDownloadDrawing: () => void
}

export function DrawingToolbar({ tool, onToolChange, onClearCanvas, onDownloadDrawing }: DrawingToolbarProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant={tool.type === "brush" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange({ ...tool, type: "brush" })}
        className="w-8 h-8 p-0 rounded-full"
      >
        <Circle className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
        <Brush className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
        <Minus className="w-4 h-4" />
      </Button>
      <Button
        variant={tool.type === "eraser" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange({ ...tool, type: "eraser" })}
        className="w-8 h-8 p-0 rounded-full"
      >
        <Eraser className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
        <Square className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
        <Triangle className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onClearCanvas} className="w-8 h-8 p-0 rounded-full">
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
        <Redo2 className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onDownloadDrawing} className="w-8 h-8 p-0 rounded-full">
        <Download className="w-4 h-4" />
      </Button>
    </div>
  )
}
