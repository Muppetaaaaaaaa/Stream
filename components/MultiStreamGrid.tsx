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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Plus, Volume2, VolumeX } from 'lucide-react'
import { EmbedNotice } from '@/components/EmbedNotice'

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
  const [showNotice, setShowNotice] = useState(true)

  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  }

  const gridClass = gridClasses[columns] || gridClasses[2]

  const firstStreamUrl = useMemo(() => {
    const s = streams[0]
    if (!s) return ''
    if (s.platform === 'twitch') return `https://www.twitch.tv/${s.channelId}`
    return `https://www.youtube.com/${s.channelId.startsWith('@') ? s.channelId : '@' + s.channelId}`
  }, [streams])

  return (
    <div className="p-4 md:p-6">
      {/* Compatibility notice */}
      {showNotice && streams.length > 0 && (
        <div className="max-w-7xl mx-auto mb-4">
          <EmbedNotice
            platform={streams[0].platform === 'twitch' ? 'twitch' : 'youtube'}
            url={firstStreamUrl}
            onDismiss={() => setShowNotice(false)}
          />
        </div>
      )}

      {/* Compact top row */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Multi-Stream</h1>
          <p className="text-slate-400 text-sm">
            {streams.length} stream{streams.length !== 1 ? 's' : ''}
            {layoutAuto ? ' • Auto layout' : ' • Manual layout'}
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

          {onToggleLayoutAuto && (
            <Button
              onClick={onToggleLayoutAuto}
              variant="outline"
              size="sm"
              className="border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 text-slate-200"
            >
              {layoutAuto ? 'Auto' : 'Manual'}
            </Button>
          )}

          {onSetColumns && (
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

          {onAddStream && (
            <Button
              onClick={onAddStream}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Streams grid */}
      <div className={`grid ${gridClass} gap-4 max-w-7xl mx-auto`}>
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className="bg-slate-900/40 border-slate-700/50 overflow-hidden group hover:border-slate-600/50 transition-all duration-300 rounded-xl"
          >
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
              <div className="w-full h-full">
                {stream.platform === 'twitch' ? (
                  <TwitchPlayer channelId={stream.channelId} muted={muteAll} />
                ) : (
                  <YouTubePlayer channelId={stream.channelId} muted={muteAll} />
                )}
              </div>

              {/* Hover overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 rounded-xl pointer-events-none">
                <div className="flex items-start justify-between pointer-events-auto">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/10">
                    {stream.platform === 'twitch' ? '🟣 Twitch' : '🔴 YouTube'}
                  </span>
                  <Button
                    onClick={() => onRemoveStream(stream.id)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 rounded-full"
                    title="Remove stream"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-end justify-between pointer-events-auto">
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-[220px]">
                      {stream.channelName}
                    </p>
                    <p className="text-xs text-slate-300">Use the player’s fullscreen button if needed</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-8 text-center">
        <p className="text-xs text-slate-500">
          Hover over any stream for controls • Use the dockable panel for settings • Fullscreen is available inside each player
        </p>
      </div>
    </div>
  )
}
