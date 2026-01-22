/**
 * Stream Theater
 *
 * UX goals:
 * - No giant top bar in viewing mode
 * - Add streams via floating + button (opens compact overlay)
 * - Dockable/floating control panel
 * - Auto layout that scales with stream count
 */

'use client'

import { useState } from 'react'
import { StreamInput } from '@/components/StreamInput'
import { MultiStreamGrid } from '@/components/MultiStreamGrid'
import { SingleStreamView } from '@/components/SingleStreamView'
import { SideMenu } from '@/components/SideMenu'
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp'
import { useStreamTheater } from '@/hooks/useStreamTheater'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Button } from '@/components/ui/button'
import { RotateCcw, Plus } from 'lucide-react'

export default function Home() {
  const {
    streams,
    viewMode,
    selectedStreamId,
    effectiveColumns,
    layoutAuto,
    muteAll,
    panel,
    lastStreams,
    presets,
    isHydrated,
    addStream,
    removeStream,
    clearAllStreams,
    selectStream,
    switchToMultiView,
    setGridColumns,
    setLayoutAuto,
    setMuteAll,
    setPanelMode,
    setPanelPosition,
    setPanelWidth,
    loadFromHistory,
    savePreset,
    loadPreset,
  } = useStreamTheater()

  const [isLoading, setIsLoading] = useState(false)
  const [showAddOverlay, setShowAddOverlay] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)

  const handleStreamSubmit = (input: string) => {
    setIsLoading(true)
    setTimeout(() => {
      addStream(input)
      setIsLoading(false)
      setShowAddOverlay(false)
    }, 200)
  }

  // Keyboard shortcuts (keep minimal and non-conflicting)
  useKeyboardShortcuts({
    onClose: () => setShowAddOverlay(false),
  })

  if (!isHydrated) return null

  const selectedStream = selectedStreamId ? streams.find((s) => s.id === selectedStreamId) : null

  // Single view
  if (viewMode === 'single' && selectedStream) {
    return (
      <>
        <SingleStreamView
          stream={selectedStream}
          muteAll={muteAll}
          onClose={switchToMultiView}
          onBackToGrid={switchToMultiView}
        />

        <SideMenu
          streams={streams}
          presets={presets}
          isOpen={panelOpen}
          panel={panel}
          layoutAuto={layoutAuto}
          columns={effectiveColumns}
          muteAll={muteAll}
          onOpenChange={setPanelOpen}
          onPanelModeChange={setPanelMode}
          onPanelPositionChange={setPanelPosition}
          onPanelWidthChange={setPanelWidth}
          onAddStream={handleStreamSubmit}
          onRemoveStream={removeStream}
          onClearAll={clearAllStreams}
          onToggleMuteAll={() => setMuteAll(!muteAll)}
          onToggleLayoutAuto={() => setLayoutAuto(!layoutAuto)}
          onSetColumns={(c) => setGridColumns(c)}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
        />

        <KeyboardShortcutsHelp />
      </>
    )
  }

  // Viewing mode
  if (streams.length > 0) {
    // Apply padding when docked so content isn't hidden under the panel
    const leftPad = panelOpen && panel.mode === 'docked-left' ? panel.width : 0
    const rightPad = panelOpen && panel.mode === 'docked-right' ? panel.width : 0

    return (
      <>
        <div
          className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black"
          style={{ paddingLeft: leftPad, paddingRight: rightPad }}
        >
          {/* Floating add button */}
          <div className="fixed left-4 top-4 z-30">
            <Button
              onClick={() => setShowAddOverlay(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              title="Add stream"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Add overlay */}
          {showAddOverlay && (
            <div className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-20 bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 shadow-2xl">
                <StreamInput onStreamSubmit={handleStreamSubmit} isLoading={isLoading} onClose={() => setShowAddOverlay(false)} />
              </div>
            </div>
          )}

          <MultiStreamGrid
            streams={streams}
            columns={effectiveColumns}
            muteAll={muteAll}
            layoutAuto={layoutAuto}
            onToggleLayoutAuto={() => setLayoutAuto(!layoutAuto)}
            onToggleMuteAll={() => setMuteAll(!muteAll)}
            onSetColumns={(c) => setGridColumns(c)}
            onRemoveStream={removeStream}
            onSelectStream={selectStream}
            onAddStream={() => setShowAddOverlay(true)}
          />
        </div>

        <SideMenu
          streams={streams}
          presets={presets}
          isOpen={panelOpen}
          panel={panel}
          layoutAuto={layoutAuto}
          columns={effectiveColumns}
          muteAll={muteAll}
          onOpenChange={setPanelOpen}
          onPanelModeChange={setPanelMode}
          onPanelPositionChange={setPanelPosition}
          onPanelWidthChange={setPanelWidth}
          onAddStream={handleStreamSubmit}
          onRemoveStream={removeStream}
          onClearAll={clearAllStreams}
          onToggleMuteAll={() => setMuteAll(!muteAll)}
          onToggleLayoutAuto={() => setLayoutAuto(!layoutAuto)}
          onSetColumns={(c) => setGridColumns(c)}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
        />

        <KeyboardShortcutsHelp />
      </>
    )
  }

  // Landing/empty state
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10 space-y-3 max-w-2xl">
        <div className="inline-block">
          <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Stream Theater
          </div>
        </div>
        <p className="text-xl text-slate-300">Watch multiple Twitch and YouTube streams side-by-side</p>
        <p className="text-sm text-slate-500">Cinematic, minimal, fast. No ads. No trackers.</p>
      </div>

      <div className="w-full max-w-2xl mb-10 bg-slate-900/40 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm">
        <StreamInput onStreamSubmit={handleStreamSubmit} isLoading={isLoading} />
      </div>

      {lastStreams.length > 0 && (
        <div className="text-center mb-10">
          <p className="text-sm text-slate-400 mb-4">Quick add from history</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
            {lastStreams.slice(0, 6).map((stream) => (
              <Button
                key={`${stream.platform}-${stream.channelId}`}
                onClick={() => loadFromHistory(stream)}
                variant="outline"
                size="sm"
                className="border-slate-700/60 bg-slate-900/30 hover:bg-slate-900/50 text-slate-200"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {stream.channelName}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-slate-500">
        <p>Tip: Use the Controls panel to dock left/right, toggle mute, and switch auto/manual layout.</p>
      </div>

      <KeyboardShortcutsHelp />
    </div>
  )
}
