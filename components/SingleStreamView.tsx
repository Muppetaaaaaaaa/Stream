/**
 * SingleStreamView Component
 * Displays a single stream in fullscreen/large view
 * Used when clicking expand on a stream in multi-view
 */

'use client';

import { StreamData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Grid3x3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SingleStreamViewProps {
  stream: StreamData;
  onClose: () => void;
  onBackToGrid: () => void;
}

interface TwitchPlayerOptions {
  width: string;
  height: string;
  channel: string;
  parent: string[];
  autoplay: boolean;
}

/**
 * Render Twitch player embed using interactive API
 */
function TwitchPlayer({ channelId, playerId }: { channelId: string; playerId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Check if Twitch script is already loaded
    if (window.Twitch && window.Twitch.Player) {
      try {
        const options: TwitchPlayerOptions = {
          width: '100%',
          height: '100%',
          channel: channelId,
          parent: [typeof window !== 'undefined' ? window.location.hostname : 'localhost'],
          autoplay: false,
        };
        new window.Twitch.Player(playerId, options);
        setIsLoading(false);
      } catch (err) {
        console.error('Error creating Twitch player:', err);
        setError('Failed to load player');
        setIsLoading(false);
      }
      return;
    }

    // Load Twitch embed script
    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      // Wait a moment for Twitch to be available
      setTimeout(() => {
        if (window.Twitch && window.Twitch.Player && containerRef.current) {
          try {
            const options: TwitchPlayerOptions = {
              width: '100%',
              height: '100%',
              channel: channelId,
              parent: [typeof window !== 'undefined' ? window.location.hostname : 'localhost'],
              autoplay: false,
            };
            new window.Twitch.Player(playerId, options);
            setIsLoading(false);
          } catch (err) {
            console.error('Error creating Twitch player:', err);
            setError('Failed to load player');
            setIsLoading(false);
          }
        } else {
          setError('Twitch player not available');
          setIsLoading(false);
        }
      }, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Twitch embed script');
      setError('Failed to load Twitch script');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [channelId, playerId]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800">
        <div className="text-center">
          <p className="text-red-400 text-sm">{error}</p>
          <p className="text-slate-400 text-xs mt-2">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} id={playerId} style={{ width: '100%', height: '100%' }} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
          <div className="text-slate-300 text-sm">Loading player...</div>
        </div>
      )}
    </>
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
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
          {stream.platform === 'twitch' ? (
            <TwitchPlayer channelId={stream.channelId} playerId={`twitch-player-single-${stream.id}`} />
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

// Extend Window interface for Twitch
declare global {
  interface Window {
    Twitch: {
      Player: new (elementId: string, options: TwitchPlayerOptions) => unknown;
    };
  }
}
