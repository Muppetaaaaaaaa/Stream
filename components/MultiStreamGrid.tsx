/**
 * MultiStreamGrid Component
 * Displays multiple streams in a responsive grid layout
 * Supports 1-5 columns with adjustable sizing
 */

'use client';

import { StreamData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize2 } from 'lucide-react';

interface MultiStreamGridProps {
  streams: StreamData[];
  gridColumns: number;
  onRemoveStream: (streamId: string) => void;
  onSelectStream: (streamId: string) => void;
  onGridColumnsChange: (columns: number) => void;
}

/**
 * Render Twitch player embed
 * Uses the official Twitch embed player
 */
function TwitchPlayer({ channelId }: { channelId: string }) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channelId}&parent=${hostname}&autoplay=false`}
      height="100%"
      width="100%"
      allowFullScreen
      allow="autoplay"
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

export function MultiStreamGrid({
  streams,
  gridColumns,
  onRemoveStream,
  onSelectStream,
  onGridColumnsChange,
}: MultiStreamGridProps) {
  if (streams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">📺</div>
          <h2 className="text-2xl font-bold text-white">No Streams Added</h2>
          <p className="text-slate-400">Add streams using the input form to get started</p>
        </div>
      </div>
    );
  }

  // Determine grid class based on column count
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  const gridClass = gridClasses[gridColumns as keyof typeof gridClasses] || gridClasses[2];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 md:p-6">
      {/* Header with controls */}
      <div className="max-w-7xl mx-auto mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Multi-Stream View
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {streams.length} stream{streams.length !== 1 ? 's' : ''} active
            </p>
          </div>

          {/* Grid column controls */}
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg p-2 backdrop-blur-sm">
            <span className="text-xs text-slate-400 px-2">Columns:</span>
            {[1, 2, 3, 4, 5].map((col) => (
              <Button
                key={col}
                onClick={() => onGridColumnsChange(col)}
                variant={gridColumns === col ? 'default' : 'outline'}
                size="sm"
                className={`w-8 h-8 p-0 ${
                  gridColumns === col
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'border-slate-600 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {col}
              </Button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onGridColumnsChange(Math.max(1, gridColumns - 1))}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Fewer Columns
          </Button>
          <Button
            onClick={() => onGridColumnsChange(Math.min(5, gridColumns + 1))}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            More Columns
          </Button>
        </div>
      </div>

      {/* Streams grid */}
      <div className={`grid ${gridClass} gap-4 max-w-7xl mx-auto`}>
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className="bg-slate-900/50 border-slate-700 overflow-hidden group hover:border-slate-600 transition-colors"
          >
            {/* Stream container */}
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              {/* Player */}
              <div className="w-full h-full">
                {stream.platform === 'twitch' ? (
                  <TwitchPlayer channelId={stream.channelId} />
                ) : (
                  <YouTubePlayer channelId={stream.channelId} />
                )}
              </div>

              {/* Overlay controls - appear on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 rounded-lg">
                {/* Top: Platform badge and channel name */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-red-600 text-white">
                      {stream.platform === 'twitch' ? '🟣 TWITCH' : '🔴 YOUTUBE'}
                    </span>
                  </div>
                  <Button
                    onClick={() => onRemoveStream(stream.id)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-black/50"
                    title="Remove stream"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Bottom: Channel name and expand button */}
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {stream.channelName}
                    </p>
                  </div>
                  <Button
                    onClick={() => onSelectStream(stream.id)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-black/50"
                    title="Expand to fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer info */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-sm text-slate-500">
        <p>Hover over streams to see controls • Click expand icon to view fullscreen</p>
      </div>
    </div>
  );
}
