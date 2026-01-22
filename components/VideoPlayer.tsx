/**
 * VideoPlayer Component
 * Embeds official Twitch or YouTube player with cinematic styling
 * Supports different video sizes and cinema mode
 */

'use client';

import { StreamData } from '@/lib/types';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  stream: StreamData;
  videoSize: 'small' | 'medium' | 'large' | 'fullscreen';
  cinemaMode: boolean;
  onSizeChange: (size: 'small' | 'medium' | 'large' | 'fullscreen') => void;
  onCinemaModeToggle: () => void;
  onClose: () => void;
}

/**
 * Get container dimensions based on video size
 */
function getContainerClasses(size: string, cinemaMode: boolean): string {
  if (cinemaMode) {
    return 'w-screen h-screen';
  }

  switch (size) {
    case 'small':
      return 'w-full max-w-2xl h-96';
    case 'medium':
      return 'w-full max-w-4xl h-[500px]';
    case 'large':
      return 'w-full max-w-6xl h-[600px]';
    case 'fullscreen':
      return 'w-screen h-screen';
    default:
      return 'w-full max-w-4xl h-[500px]';
  }
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
 * Handles both @handle and channel ID formats
 */
function YouTubePlayer({ channelId }: { channelId: string }) {
  // Clean the channel ID (remove @ if present)
  const cleanId = channelId.replace('@', '');

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/@${cleanId}/live`}
        height="100%"
        width="100%"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="rounded-lg"
        title={`YouTube Stream - ${cleanId}`}
      />
    </div>
  );
}

export function VideoPlayer({
  stream,
  videoSize,
  cinemaMode,
  onSizeChange,
  onCinemaModeToggle,
  onClose,
}: VideoPlayerProps) {
  const containerClasses = getContainerClasses(videoSize, cinemaMode);

  return (
    <div
      className={`relative ${containerClasses} transition-all duration-300 ${
        cinemaMode ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
    >
      {/* Video container with cinematic styling */}
      <div className="w-full h-full relative group">
        {/* Player embed */}
        <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl">
          {stream.platform === 'twitch' ? (
            <TwitchPlayer channelId={stream.channelId} />
          ) : (
            <YouTubePlayer channelId={stream.channelId} />
          )}
        </div>

        {/* Control overlay - appears on hover */}
        {!cinemaMode && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex flex-col justify-between p-4 pointer-events-none">
            {/* Top controls */}
            <div className="flex justify-between items-start pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-red-600 text-white">
                  {stream.platform === 'twitch' ? '🟣 TWITCH' : '🔴 YOUTUBE'}
                </span>
                <span className="text-sm text-white font-medium">{stream.channelName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-black/50"
                title="Close stream (Esc)"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Bottom controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Size controls */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSizeChange('small')}
                  className={`text-white hover:bg-black/50 ${videoSize === 'small' ? 'bg-black/50' : ''}`}
                  title="Small (S)"
                >
                  S
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSizeChange('medium')}
                  className={`text-white hover:bg-black/50 ${videoSize === 'medium' ? 'bg-black/50' : ''}`}
                  title="Medium (M)"
                >
                  M
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSizeChange('large')}
                  className={`text-white hover:bg-black/50 ${videoSize === 'large' ? 'bg-black/50' : ''}`}
                  title="Large (L)"
                >
                  L
                </Button>
              </div>

              {/* Cinema mode toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onCinemaModeToggle}
                className="text-white hover:bg-black/50"
                title="Cinema mode (C)"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Cinema mode close button */}
        {cinemaMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCinemaModeToggle}
            className="absolute top-4 right-4 text-white hover:bg-black/50 z-10"
            title="Exit cinema mode (C)"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
