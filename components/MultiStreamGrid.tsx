/**
 * MultiStreamGrid Component
 * Displays multiple streams in an auto-adjusting responsive grid layout.
 * Uses iframes for maximum cross-browser compatibility.
 *
 * Note: We intentionally do NOT provide an "app-level fullscreen" mode.
 * Twitch/YouTube already expose their own fullscreen controls inside the iframe,
 * and trying to wrap/override them tends to break controls and permissions.
 */

'use client'

import { useMemo, useState } from 'react'
import { StreamData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'
import { DraggableStreamCard } from '@/components/DraggableStreamCard'

interface MultiStreamGridProps {
  streams: StreamData[]
  /** computed columns (auto or manual) */
  columns: number
  muteAll: boolean
  onRemoveStream: (streamId: string) => void
  onAddStream?: () => void
  onToggleMuteAll?: () => void
  onSetColumns?: (columns: number) => void
  layoutAuto?: boolean
  onToggleLayoutAuto?: () => void
}

interface Position {
  x: number
  y: number
  width: number
  height: number
}

function TwitchPlayer({ channelId, muted }: { channelId: string; muted: boolean }) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const src = `https://player.twitch.tv/?channel=${encodeURIComponent(channelId)}&parent=${encodeURIComponent(
    hostname
  )}&autoplay=false&muted=${muted ? 'true' : 'false'}`

  return (
    <iframe
      src={src}
      height="100%"
      width="100%"
      allowFullScreen
      allow="autoplay; fullscreen"
      className="rounded-xl"
      title={`Twitch Stream - ${channelId}`}
      loading="lazy"
      referrerPolicy="origin-when-cross-origin"
    />
  )
}

function YouTubePlayer({ channelId, muted }: { channelId: string; muted: boolean }) {
  const cleanId = channelId.replace('@', '')
  const src = `https://www.youtube.com/embed/@${encodeURIComponent(cleanId)}/live?autoplay=0&mute=${muted ? '1' : '0'}`

  return (
    <iframe
      src={src}
      height="100%"
      width="100%"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      className="rounded-xl"
      title={`YouTube Stream - ${cleanId}`}
      loading="lazy"
      referrerPolicy="origin-when-cross-origin"
    />
  )
}

export function MultiStreamGrid({
  streams,
  columns,
  muteAll,
  onRemoveStream,
  onAddStream,
  onToggleMuteAll,
  onSetColumns,
  layoutAuto,
  onToggleLayoutAuto,
}: MultiStreamGridProps) {
  const [freeFloatingMode, setFreeFloatingMode] = useState(false)
  const [streamPositions, setStreamPositions] = useState<Record<string, Position>>({})

  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  }

  const gridClass = gridClasses[columns] || gridClasses[2]

  const handlePositionChange = (streamId: string, position: Position) => {
    setStreamPositions((prev) => ({
      ...prev,
      [streamId]: position,
    }))
  }

  return (
    <div className={freeFloatingMode ? 'relative w-full h-screen' : 'p-4 md:p-6'}>
      {/* Compact top row */}
      <div className={`${freeFloatingMode ? 'fixed top-4 left-4 right-4 z-40' : 'max-w-7xl mx-auto mb-6'} flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/60`}>
        <div>
          <h1 className="text-2xl font-bold text-white">Multi-Stream</h1>
          <p className="text-slate-400 text-sm">
            {streams.length} stream{streams.length !== 1 ? 's' : ''}
            {layoutAuto ? ' • Auto layout' : ' • Manual layout'}
            {freeFloatingMode ? ' • Free Floating' : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {onToggleMuteAll && (
            <Button
              onClick={onToggleMuteAll}
              variant="outline"
              size="sm"
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
          )}

          {onToggleLayoutAuto && !freeFloatingMode && (
            <Button
              onClick={onToggleLayoutAuto}
              variant="outline"
              size="sm"
              className="border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 text-slate-200"
            >
              {layoutAuto ? 'Auto' : 'Manual'}
            </Button>
          )}

          {onSetColumns && !freeFloatingMode && (
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
          )}

          {/* Free Floating Toggle */}
          <Button
            onClick={() => setFreeFloatingMode(!freeFloatingMode)}
            variant={freeFloatingMode ? 'default' : 'outline'}
            size="sm"
            className={freeFloatingMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 text-slate-200'}
          >
            {freeFloatingMode ? (
              <>
                <Minimize2 className="w-4 h-4 mr-2" />
                Grid
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 mr-2" />
                Float
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Streams - Grid or Free Floating */}
      {freeFloatingMode ? (
        // Free floating mode - absolute positioning
        <div className="relative w-full h-screen">
          {streams.map((stream) => (
            <DraggableStreamCard
              key={stream.id}
              stream={stream}
              isGridMode={false}
              onRemoveStream={onRemoveStream}
              onPositionChange={handlePositionChange}
              savedPosition={streamPositions[stream.id]}
            >
              {stream.platform === 'twitch' ? (
                <TwitchPlayer channelId={stream.channelId} muted={muteAll} />
              ) : (
                <YouTubePlayer channelId={stream.channelId} muted={muteAll} />
              )}
            </DraggableStreamCard>
          ))}
        </div>
      ) : (
        // Grid mode
        <div className={`grid ${gridClass} gap-4 max-w-7xl mx-auto`}>
          {streams.map((stream) => (
            <DraggableStreamCard
              key={stream.id}
              stream={stream}
              isGridMode={true}
              onRemoveStream={onRemoveStream}
            >
              {stream.platform === 'twitch' ? (
                <TwitchPlayer channelId={stream.channelId} muted={muteAll} />
              ) : (
                <YouTubePlayer channelId={stream.channelId} muted={muteAll} />
              )}
            </DraggableStreamCard>
          ))}
        </div>
      )}

      {!freeFloatingMode && (
        <div className="max-w-7xl mx-auto mt-8 text-center">
          <p className="text-xs text-slate-500">
            Use the player controls for fullscreen • Use the dockable panel for settings • Click "Float" to drag and resize streams freely
          </p>
        </div>
      )}
    </div>
  )
}
