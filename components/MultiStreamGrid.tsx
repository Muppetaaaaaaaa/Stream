/**
 * MultiStreamGrid Component
 * Displays multiple streams in an auto-adjusting responsive grid layout
 */

'use client';

import { StreamData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Plus } from 'lucide-react';

interface MultiStreamGridProps {
  streams: StreamData[];
  gridColumns: number;
  onRemoveStream: (streamId: string) => void;
  onSelectStream: (streamId: string) => void;
  onGridColumnsChange: (columns: number) => void;
  onAddStream?: () => void;
}

/**
 * Render Twitch player embed using iframe
 */
function TwitchPlayer({ channelId }: { channelId: string }) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channelId}&parent=${hostname}&autoplay=false&muted=false`}
      height="100%"
      width="100%"
      allowFullScreen
      allow="autoplay"
      className="rounded-xl"
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
      className="rounded-xl"
      title={`YouTube Stream - ${cleanId}`}
    />
  );
}

/**
 * Auto-determine best grid columns based on stream count
 */
function getAutoColumns(streamCount: number): number {
  if (streamCount <= 1) return 1;
  if (streamCount <= 4) return 2;
  if (streamCount <= 9) return 3;
  return 4;
}

export function MultiStreamGrid({
  streams,
  gridColumns,
  onRemoveStream,
  onSelectStream,
  onGridColumnsChange,
  onAddStream,
}: MultiStreamGridProps) {
  if (streams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">📺</div>
          <h2 className="text-2xl font-bold text-white">No Streams Yet</h2>
          <p className="text-slate-400">
            Add your first stream to start watching multiple creators side-by-side
          </p>
          {onAddStream && (
            <Button
              onClick={onAddStream}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Stream
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Use auto columns if gridColumns is not set
  const effectiveColumns = gridColumns || getAutoColumns(streams.length);

  // Responsive grid classes
  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  const gridClass = gridClasses[effectiveColumns] || gridClasses[2];

  return (
    <div className="p-4 md:p-6">
      {/* Compact header */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Multi-Stream</h1>
          <p className="text-slate-400 text-sm">
            {streams.length} stream{streams.length !== 1 ? 's' : ''} • Auto-layout enabled
          </p>
        </div>

        {/* Quick layout controls */}
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-2 backdrop-blur-sm">
          <span className="text-xs text-slate-400 px-2">Layout</span>
          {[1, 2, 3, 4, 5].map((col) => (
            <Button
              key={col}
              onClick={() => onGridColumnsChange(col)}
              variant={effectiveColumns === col ? 'default' : 'outline'}
              size="sm"
              className={`w-8 h-8 p-0 rounded-lg ${
                effectiveColumns === col
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'border-slate-600/50 text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {col}
            </Button>
          ))}
        </div>
      </div>

      {/* Streams grid */}
      <div className={`grid ${gridClass} gap-4 max-w-7xl mx-auto`}>
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className="bg-slate-900/40 border-slate-700/50 overflow-hidden group hover:border-slate-600/50 transition-all duration-300 rounded-xl"
          >
            {/* Stream container */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
              {/* Player */}
              <div className="w-full h-full">
                {stream.platform === 'twitch' ? (
                  <TwitchPlayer channelId={stream.channelId} />
                ) : (
                  <YouTubePlayer channelId={stream.channelId} />
                )}
              </div>

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 rounded-xl pointer-events-none">
                {/* Top controls */}
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

                {/* Bottom controls */}
                <div className="flex items-end justify-between pointer-events-auto">
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                      {stream.channelName}
                    </p>
                    <p className="text-xs text-slate-300">Click to expand</p>
                  </div>
                  <Button
                    onClick={() => onSelectStream(stream.id)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 rounded-full"
                    title="Expand"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer tip */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <p className="text-xs text-slate-500">
          Hover over any stream for controls • Drag the settings panel anywhere • Layout auto-adjusts as you add streams
        </p>
      </div>
    </div>
  );
}
