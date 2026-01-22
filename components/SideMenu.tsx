/**
 * SideMenu
 *
 * Requirements:
 * - Dockable left/right
 * - Can switch to floating and be dragged
 * - Persisted via parent state (localStorage in useStreamTheater)
 * - Fast stream management and global settings
 */

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PanelMode, PanelState, StreamData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Maximize2,
  Minimize2,
  Move,
  Plus,
  Save,
  Download,
  Trash2,
  X,
  Volume2,
  VolumeX,
  LayoutGrid,
  Wand2,
  Settings,
} from 'lucide-react'

interface SideMenuProps {
  streams: StreamData[]
  presets: { name: string; streams: StreamData[] }[]

  isOpen: boolean
  panel: PanelState

  layoutAuto: boolean
  columns: number
  muteAll: boolean

  onOpenChange: (open: boolean) => void
  onPanelModeChange: (mode: PanelMode) => void
  onPanelPositionChange: (x: number, y: number) => void
  onPanelWidthChange: (width: number) => void

  onAddStream: (input: string) => void
  onRemoveStream: (streamId: string) => void
  onClearAll: () => void

  onToggleMuteAll: () => void
  onToggleLayoutAuto: () => void
  onSetColumns: (columns: number) => void

  onSavePreset: (name: string) => void
  onLoadPreset: (name: string) => void
}

export function SideMenu({
  streams,
  presets,
  isOpen,
  panel,
  layoutAuto,
  columns,
  muteAll,
  onOpenChange,
  onPanelModeChange,
  onPanelPositionChange,
  onPanelWidthChange,
  onAddStream,
  onRemoveStream,
  onClearAll,
  onToggleMuteAll,
  onToggleLayoutAuto,
  onSetColumns,
  onSavePreset,
  onLoadPreset,
}: SideMenuProps) {
  const [newStreamInput, setNewStreamInput] = useState('')
  const [presetName, setPresetName] = useState('')

  // dragging for floating mode
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const isDocked = panel.mode === 'docked-left' || panel.mode === 'docked-right'

  const shellStyle = useMemo(() => {
    if (!isOpen) return { display: 'none' } as React.CSSProperties

    if (panel.mode === 'floating') {
      return {
        position: 'fixed',
        left: panel.x,
        top: panel.y,
        width: panel.width,
        zIndex: 50,
      } as React.CSSProperties
    }

    // docked
    const dockRight = panel.mode === 'docked-right'
    return {
      position: 'fixed',
      top: 0,
      bottom: 0,
      width: panel.width,
      zIndex: 40,
      left: dockRight ? 'auto' : 0,
      right: dockRight ? 0 : 'auto',
    } as React.CSSProperties
  }, [isOpen, panel.mode, panel.width, panel.x, panel.y])

  // Clamp floating position in viewport (basic)
  useEffect(() => {
    if (panel.mode !== 'floating') return
    if (typeof window === 'undefined') return

    const maxX = Math.max(0, window.innerWidth - panel.width - 8)
    const maxY = Math.max(0, window.innerHeight - 120)

    const clampedX = Math.min(Math.max(8, panel.x), maxX)
    const clampedY = Math.min(Math.max(8, panel.y), maxY)

    if (clampedX !== panel.x || clampedY !== panel.y) {
      onPanelPositionChange(clampedX, clampedY)
    }
  }, [panel.mode, panel.width, panel.x, panel.y, onPanelPositionChange])

  useEffect(() => {
    if (!isDragging) return

    const onMove = (e: MouseEvent) => {
      onPanelPositionChange(e.clientX - dragOffset.x, e.clientY - dragOffset.y)
    }
    const onUp = () => setIsDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, dragOffset, onPanelPositionChange])

  const startDrag = (e: React.MouseEvent) => {
    if (panel.mode !== 'floating') return
    if (!menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setIsDragging(true)
  }

  const handleAddStream = () => {
    if (!newStreamInput.trim()) return
    onAddStream(newStreamInput.trim())
    setNewStreamInput('')
  }

  const handleSavePreset = () => {
    if (!presetName.trim()) return
    onSavePreset(presetName.trim())
    setPresetName('')
  }

  const toggleDockSide = () => {
    if (panel.mode === 'docked-left') onPanelModeChange('docked-right')
    else onPanelModeChange('docked-left')
  }

  const toggleDockFloating = () => {
    if (panel.mode === 'floating') {
      onPanelModeChange('docked-right')
    } else {
      onPanelModeChange('floating')
    }
  }

  const headerClass = isDocked
    ? 'cursor-default'
    : panel.mode === 'floating'
      ? 'cursor-move'
      : 'cursor-default'

  return (
    <>
      {/* Toggle button - redesigned and positioned to not block menu */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="fixed z-50 p-2.5 text-slate-300 hover:text-white transition-colors duration-200"
        style={{
          right: isOpen && isDocked ? panel.width + 8 : 16,
          top: 16,
        }}
        title={isOpen ? 'Close controls' : 'Open controls'}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-800/50 transition-colors">
          {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </div>
      </button>

      {/* Panel */}
      <div style={shellStyle}>
        <div
          ref={menuRef}
          className={`h-full max-h-[90vh] ${
            isDocked ? 'rounded-none' : 'rounded-2xl'
          } bg-slate-900/92 border border-slate-700/70 shadow-2xl overflow-hidden backdrop-blur-md flex flex-col`}
        >
          {/* Header */}
          <div
            onMouseDown={startDrag}
            className={`flex items-center gap-2 bg-slate-800/50 border-b border-slate-700/60 px-4 py-3 ${headerClass}`}
          >
            {panel.mode === 'floating' ? (
              <Move className="w-4 h-4 text-slate-400" />
            ) : (
              <LayoutGrid className="w-4 h-4 text-slate-400" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Controls</p>
              <p className="text-xs text-slate-400">
                {streams.length} stream{streams.length !== 1 ? 's' : ''} • {layoutAuto ? 'Auto' : 'Manual'}
              </p>
            </div>

            {/* Dock left/right */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:bg-slate-700/50"
              onClick={toggleDockSide}
              title="Dock to other side"
            >
              {panel.mode === 'docked-left' ? (
                <ArrowRightToLine className="w-4 h-4" />
              ) : (
                <ArrowLeftToLine className="w-4 h-4" />
              )}
            </Button>

            {/* Dock / float */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:bg-slate-700/50"
              onClick={toggleDockFloating}
              title={panel.mode === 'floating' ? 'Dock panel' : 'Float panel'}
            >
              {panel.mode === 'floating' ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={onToggleMuteAll}
                variant="outline"
                className="border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 text-slate-200"
              >
                {muteAll ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Muted
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Sound
                  </>
                )}
              </Button>

              <Button
                onClick={onToggleLayoutAuto}
                variant="outline"
                className="border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 text-slate-200"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {layoutAuto ? 'Auto' : 'Manual'}
              </Button>
            </div>

            {/* Add stream */}
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-slate-300">ADD STREAM</p>
              <div className="flex gap-2">
                <Input
                  value={newStreamInput}
                  onChange={(e) => setNewStreamInput(e.target.value)}
                  placeholder="twitch.tv/name or @youtube"
                  className="bg-slate-800/70 border-slate-700/60 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleAddStream}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!newStreamInput.trim()}
                  title="Add"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Layout */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-slate-300">LAYOUT</p>
                <p className="text-xs text-slate-500">Columns: {columns}</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-1">
                {[1, 2, 3, 4, 5].map((col) => (
                  <Button
                    key={col}
                    onClick={() => onSetColumns(col)}
                    variant={columns === col ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-8 h-8 p-0 rounded-lg ${
                      columns === col
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {col}
                  </Button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Tip: Auto layout picks columns based on stream count.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-slate-300">PRESETS</p>
              <div className="flex gap-2">
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Name"
                  className="bg-slate-800/70 border-slate-700/60 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleSavePreset}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!presetName.trim() || streams.length === 0}
                  title="Save preset"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>

              {presets.length > 0 && (
                <div className="space-y-2">
                  {presets.map((p) => (
                    <Button
                      key={p.name}
                      onClick={() => onLoadPreset(p.name)}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 text-slate-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {p.name}
                      <span className="ml-auto text-xs text-slate-500">{p.streams.length}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Active streams */}
            {streams.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wide text-slate-300">STREAMS</p>
                  <Button
                    onClick={onClearAll}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {streams.map((s) => (
                    <Card
                      key={s.id}
                      className="bg-slate-800/60 border-slate-700/60 p-2 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate max-w-[190px]">
                          {s.channelName}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {s.platform === 'twitch' ? '🟣 Twitch' : '🔴 YouTube'}
                        </p>
                      </div>
                      <Button
                        onClick={() => onRemoveStream(s.id)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:bg-slate-700/50"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Card className="bg-slate-800/40 border-slate-700/60 p-3">
              <p className="text-[11px] text-slate-400">
                Having issues in Brave/Opera? Their privacy shields may block 3rd-party cookies for embeds.
                If a player is blank, allow cookies for <span className="text-slate-200">twitch.tv</span> / <span className="text-slate-200">youtube.com</span>,
                or open the stream in a new tab.
              </p>
            </Card>
          </div>

          {/* Footer / resize (docked only) */}
          {isDocked && (
            <div className="border-t border-slate-700/60 p-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Width</p>
              <input
                aria-label="Panel width"
                type="range"
                min={280}
                max={480}
                value={panel.width}
                onChange={(e) => onPanelWidthChange(Number(e.target.value))}
                className="w-40"
              />
            </div>
          )}
        </div>
      </div>

      {/* Overlay on mobile when docked */}
      {isOpen && isDocked && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => onOpenChange(false)} />
      )}
    </>
  )
}
