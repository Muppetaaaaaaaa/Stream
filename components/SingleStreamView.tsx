/**
 * SingleStreamView Component
 * Displays a single stream in fullscreen/large view
 * Used when clicking expand on a stream in multi-view
 */

'use client';

import { StreamData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Grid3x3 } from 'lucide-react';

interface SingleStreamViewProps {
  stream: StreamData;
  onClose: () => void;
  onBackToGrid: () => void;
}

/**
 * Render Twitch player embed
 */
function TwitchPlayer({ channelId }: { channelId: string }) {
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channelId}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
      height="100%"
      width="100%"
      allowFullScreen
      className="rounded-lg"
      title={`Twitch Stream - ${channelId}`}
    />
  );
}

/**
 * Render YouTube player embed
 */
function YouTubePlayer({ channelId }: { channelId: string }) {
  const cleanId = channelId.replace('@', '');

  return (
    <iframe
      src={`https://www.youtube.com/embed/@${cleanId}/live`}
      height="100%"
      width="100%"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      className="rounded-lg"
      title={`YouTube Stream - ${cleanId}`}
    />
  );
}

export function SingleStreamView({
  stream,
  onClose,
  onBackToGrid,
}: SingleStreamViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header with controls */}
        <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-slate-400">Now watching</p>
              <p className="text-lg font-semibold text-white">
                {stream.channelName}
                <span className="ml-2 text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                  {stream.platform === 'twitch' ? '🟣 Twitch' : '🔴 YouTube'}
                </span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onBackToGrid}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Back to Grid
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Video player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {stream.platform === 'twitch' ? (
            <TwitchPlayer channelId={stream.channelId} />
          ) : (
            <YouTubePlayer channelId={stream.channelId} />
          )}
        </div>

        {/* Info footer */}
        <p className="text-xs text-slate-500 text-center">
          Click &quot;Back to Grid&quot; to return to multi-stream view
        </p>
      </div>
    </div>
  );
}
