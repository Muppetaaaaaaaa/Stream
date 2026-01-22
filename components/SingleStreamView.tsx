/**
 * SingleStreamView
 *
 * Shows one stream in a large player.
 * Uses iframes (no JS player API) for maximum cross-browser compatibility.
 */

'use client'

import type { StreamData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { X, Grid3x3, ExternalLink } from 'lucide-react'

interface SingleStreamViewProps {
  stream: StreamData
  muteAll: boolean
  onClose: () => void
  onBackToGrid: () => void
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

export function SingleStreamView({ stream, muteAll, onClose, onBackToGrid }: SingleStreamViewProps) {
  const twitchHref = `https://www.twitch.tv/${stream.channelId}`
  const youtubeHref = `https://www.youtube.com/${stream.channelId.startsWith('@') ? stream.channelId : '@' + stream.channelId}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-slate-900/50 border border-slate-700/60 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-slate-400">Now watching</p>
              <p className="text-lg font-semibold text-white">
                {stream.channelName}{' '}
                <span className="ml-2 text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {stream.platform === 'twitch' ? '🟣 Twitch' : '🔴 YouTube'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onBackToGrid}
              variant="outline"
              size="sm"
              className="border-slate-700/60 bg-slate-900/30 hover:bg-slate-900/50 text-slate-200"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Back to Grid
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-700/60 bg-slate-900/30 hover:bg-slate-900/50 text-slate-200"
            >
              <a
                href={stream.platform === 'twitch' ? twitchHref : youtubeHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </a>
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-slate-700/60 bg-slate-900/30 hover:bg-slate-900/50 text-slate-200"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          {stream.platform === 'twitch' ? (
            <TwitchPlayer channelId={stream.channelId} muted={muteAll} />
          ) : (
            <YouTubePlayer channelId={stream.channelId} muted={muteAll} />
          )}
        </div>

        <p className="text-xs text-slate-500 text-center">
          If you see a blank player in Brave/Opera, try allowing 3rd-party cookies (Brave Shields) for twitch.tv / youtube.com,
          or click “Open”.
        </p>
      </div>
    </div>
  )
}
