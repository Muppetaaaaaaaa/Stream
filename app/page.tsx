/**
 * Stream Theater - Main Page
 * Multi-stream cinematic livestream viewing experience
 * Supports both Twitch and YouTube with side menu controls
 */

'use client';

import { useState } from 'react';
import { StreamInput } from '@/components/StreamInput';
import { MultiStreamGrid } from '@/components/MultiStreamGrid';
import { SingleStreamView } from '@/components/SingleStreamView';
import { SideMenu } from '@/components/SideMenu';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { useStreamTheater } from '@/hooks/useStreamTheater';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const {
    streams,
    viewMode,
    selectedStreamId,
    gridColumns,
    lastStreams,
    presets,
    isHydrated,
    addStream,
    removeStream,
    clearAllStreams,
    selectStream,
    switchToMultiView,
    setGridColumns,
    loadFromHistory,
    savePreset,
    loadPreset,
  } = useStreamTheater();

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle stream submission
   */
  const handleStreamSubmit = (input: string) => {
    setIsLoading(true);
    setTimeout(() => {
      addStream(input);
      setIsLoading(false);
    }, 500);
  };

  /**
   * Setup keyboard shortcuts
   */
  useKeyboardShortcuts({
    onToggleChat: () => {},
    onToggleCinemaMode: () => {},
    onClose: clearAllStreams,
    onSizeSmall: () => setGridColumns(1),
    onSizeMedium: () => setGridColumns(2),
    onSizeLarge: () => setGridColumns(3),
  });

  // Don't render until hydrated
  if (!isHydrated) {
    return null;
  }

  // Single stream view
  if (viewMode === 'single' && selectedStreamId) {
    const selectedStream = streams.find((s) => s.id === selectedStreamId);
    if (selectedStream) {
      return (
        <>
          <SingleStreamView
            stream={selectedStream}
            onClose={clearAllStreams}
            onBackToGrid={switchToMultiView}
          />
          <SideMenu
            streams={streams}
            gridColumns={gridColumns}
            onAddStream={handleStreamSubmit}
            onRemoveStream={removeStream}
            onClearAll={clearAllStreams}
            onGridColumnsChange={setGridColumns}
            onSavePreset={savePreset}
            onLoadPreset={loadPreset}
            savedPresets={presets}
          />
          <KeyboardShortcutsHelp />
        </>
      );
    }
  }

  // Multi-stream view
  if (streams.length > 0) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
          {/* Top input bar */}
          <div className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-700 backdrop-blur-sm p-4">
            <div className="max-w-7xl mx-auto">
              <StreamInput onStreamSubmit={handleStreamSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Streams grid */}
          <MultiStreamGrid
            streams={streams}
            gridColumns={gridColumns}
            onRemoveStream={removeStream}
            onSelectStream={selectStream}
            onGridColumnsChange={setGridColumns}
          />
        </div>

        {/* Side menu */}
        <SideMenu
          streams={streams}
          gridColumns={gridColumns}
          onAddStream={handleStreamSubmit}
          onRemoveStream={removeStream}
          onClearAll={clearAllStreams}
          onGridColumnsChange={setGridColumns}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
          savedPresets={presets}
        />

        {/* Keyboard shortcuts help */}
        <KeyboardShortcutsHelp />
      </>
    );
  }

  // Initial state - landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-block">
          <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
            Stream Theater
          </div>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl">
          Watch multiple Twitch and YouTube streams side-by-side
        </p>
        <p className="text-sm text-slate-500">
          Add as many streams as you want in a responsive grid layout
        </p>
      </div>

      {/* Input form */}
      <StreamInput onStreamSubmit={handleStreamSubmit} isLoading={isLoading} />

      {/* Last streams quick access */}
      {lastStreams.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 mb-3">Quick add from history</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
            {lastStreams.slice(0, 5).map((stream) => (
              <Button
                key={`${stream.platform}-${stream.channelId}`}
                onClick={() => loadFromHistory(stream)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {stream.channelName}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Features grid */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-2xl mb-2">📺</div>
          <h3 className="font-semibold text-white mb-2">Multi-Stream</h3>
          <p className="text-sm text-slate-400">
            Watch 2, 3, 4, or 5 streams side-by-side
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-2xl mb-2">🔄</div>
          <h3 className="font-semibold text-white mb-2">Multi-Platform</h3>
          <p className="text-sm text-slate-400">
            Mix Twitch and YouTube streams together
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold text-white mb-2">Responsive Grid</h3>
          <p className="text-sm text-slate-400">
            Automatically adapts to your screen size
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-2xl mb-2">🎬</div>
          <h3 className="font-semibold text-white mb-2">Fullscreen View</h3>
          <p className="text-sm text-slate-400">
            Click expand to view any stream fullscreen
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-2xl mb-2">💾</div>
          <h3 className="font-semibold text-white mb-2">Save Presets</h3>
          <p className="text-sm text-slate-400">
            Save and load your favorite stream combinations
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-2xl mb-2">📱</div>
          <h3 className="font-semibold text-white mb-2">Responsive</h3>
          <p className="text-sm text-slate-400">
            Works on desktop, tablet, and mobile
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-slate-500">
        <p>No ads • No trackers • Fast load times • Fully accessible</p>
      </div>

      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp />
    </div>
  );
}
