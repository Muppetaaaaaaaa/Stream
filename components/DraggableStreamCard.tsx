/**
 * DraggableStreamCard
 * 
 * A stream card that can be dragged and resized freely on the screen.
 * Supports both grid layout and free-floating modes.
 */

'use client'

import { useRef, useState, useEffect } from 'react'
import { StreamData } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Move } from 'lucide-react'

interface Position {
  x: number
  y: number
  width: number
  height: number
}

interface DraggableStreamCardProps {
  stream: StreamData
  isGridMode: boolean
  onRemoveStream: (streamId: string) => void
  children: React.ReactNode
  onPositionChange?: (streamId: string, position: Position) => void
  savedPosition?: Position
}

export function DraggableStreamCard({
  stream,
  isGridMode,
  onRemoveStream,
  children,
  onPositionChange,
  savedPosition,
}: DraggableStreamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState<Position>(
    savedPosition || {
      x: 0,
      y: 0,
      width: 400,
      height: 225,
    }
  )

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (isGridMode || !cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (isGridMode || !cardRef.current) return
    e.preventDefault()
    
    const rect = cardRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.right,
      y: e.clientY - rect.bottom,
    })
    setIsResizing(true)
  }

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Clamp to viewport
        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - position.width))
        const clampedY = Math.max(0, Math.min(newY, window.innerHeight - position.height))

        setPosition((prev) => ({
          ...prev,
          x: clampedX,
          y: clampedY,
        }))
      } else if (isResizing) {
        const newWidth = Math.max(300, e.clientX - position.x)
        const newHeight = Math.max(169, e.clientY - position.y)

        setPosition((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }))
      }
    }

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        setIsDragging(false)
        setIsResizing(false)
        onPositionChange?.(stream.id, position)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, position, stream.id, onPositionChange])

  // Grid mode - normal card
  if (isGridMode) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 overflow-hidden rounded-xl relative group">
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
          <div className="w-full h-full">{children}</div>
          
          {/* Remove button - visible on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => onRemoveStream(stream.id)}
              variant="ghost"
              size="icon"
              className="bg-red-600/80 hover:bg-red-700 text-white h-8 w-8"
              title="Remove stream"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Free-floating mode
  return (
    <div
      ref={cardRef}
      className="fixed bg-slate-900/95 border border-slate-700/70 rounded-xl shadow-2xl overflow-hidden z-20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      }}
    >
      {/* Header - drag handle */}
      <div
        onMouseDown={handleDragStart}
        className="bg-slate-800/60 border-b border-slate-700/60 px-3 py-2 flex items-center justify-between cursor-move hover:bg-slate-800/80 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Move className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <p className="text-xs font-semibold text-white truncate">
            {stream.platform === 'twitch' ? '🟣' : '🔴'} {stream.channelName}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            onClick={() => onRemoveStream(stream.id)}
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:bg-slate-700/50 h-6 w-6"
            title="Remove stream"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Player */}
      <div className="relative w-full flex-1 bg-black overflow-hidden" style={{ height: `calc(100% - 32px)` }}>
        <div className="w-full h-full">{children}</div>
      </div>

      {/* Resize handle - bottom right corner */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-purple-600 to-transparent cursor-se-resize hover:from-purple-500 transition-colors"
        title="Drag to resize"
      />
    </div>
  )
}
