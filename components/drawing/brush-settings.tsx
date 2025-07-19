"use client"

import { Slider } from "@/components/ui/slider"
import type { DrawingTool } from "@/types"

interface BrushSettingsProps {
  tool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
}

export function BrushSettings({ tool, onToolChange }: BrushSettingsProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <input
        type="color"
        value={tool.color}
        onChange={(e) => onToolChange({ ...tool, color: e.target.value })}
        className="w-6 h-6 rounded border border-gray-300"
      />
      <div className="w-8 h-6 bg-gray-300 rounded"></div>
      <div className="flex-1">
        <Slider
          value={[tool.size]}
          onValueChange={(value) => onToolChange({ ...tool, size: value[0] })}
          max={30}
          min={1}
          step={1}
          className="flex-1"
        />
      </div>
      <span className="text-sm font-mono text-gray-600">Size: {tool.size}</span>
    </div>
  )
}
