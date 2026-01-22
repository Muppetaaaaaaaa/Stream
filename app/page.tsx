/**
 * Stream Theater - Main Page
 * Modern, cinematic livestream viewing experience
 * Supports both Twitch and YouTube with advanced controls
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
import { RotateCcw, Plus } from 'lucide-react';

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
  const [showAddStream, setShowAddStream] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  /**
   * Handle stream submission
   */
  const handleStreamSubmit = (input: string) => {
    setIsLoading(true);
    setTimeout(() => {
      addStream(input);
      setIsLoading(false);
      setShowAddStream(false);
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
            isOpen={sideMenuOpen}
            onOpenChange={setSideMenuOpen}
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
          {/* Floating Add Stream Button */}
          {!showAddStream && (
            <div className="fixed top-4 left-4 z-30">
              <Button
                onClick={() => setShowAddStream(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
                title="Add new stream (Ctrl+N)"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Compact Add Stream Bar - Only when visible */}
          {showAddStream && (
            <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900 to-transparent border-b border-slate-700/50 backdrop-blur-md p-4">
              <div className="max-w-2xl mx-auto">
                <StreamInput 
                  onStreamSubmit={handleStreamSubmit} 
                  isLoading={isLoading}
                  onClose={() => setShowAddStream(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`transition-all duration-300 ${showAddStream ? 'pt-24' : 'pt-4'}`}>
            <MultiStreamGrid
              streams={streams}
              gridColumns={gridColumns}
              onRemoveStream={removeStream}
              onSelectStream={selectStream}
              onGridColumnsChange={setGridColumns}
              onAddStream={() => setShowAddStream(true)}
            />
          </div>
        </div>

        {/* Side Menu */}
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
          isOpen={sideMenuOpen}
          onOpenChange={setSideMenuOpen}
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
      <div className="text-center mb-12 space-y-4 max-w-2xl">
        <div className="inline-block">
          <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
            Stream Theater
          </div>
        </div>
        <p className="text-xl text-slate-300">
          Watch multiple Twitch and YouTube streams side-by-side
        </p>
        <p className="text-sm text-slate-500">
          Cinematic viewing experience with zero distractions
        </p>
      </div>

      {/* Main Input */}
      <div className="w-full max-w-2xl mb-16">
        <StreamInput 
          onStreamSubmit={handleStreamSubmit} 
          isLoading={isLoading}
          onClose={() => {}}
        />
      </div>

      {/* Last streams quick access */}
      {lastStreams.length > 0 && (
        <div className="text-center mb-16">
          <p className="text-sm text-slate-400 mb-4">Quick add from history</p>
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
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <div className="text-3xl mb-3">📺</div>
          <h3 className="font-semibold text-white mb-2">Multi-Stream</h3>
          <p className="text-sm text-slate-400">
            Watch 2, 3, 4, or 5 streams side-by-side simultaneously
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="font-semibold text-white mb-2">Multi-Platform</h3>
          <p className="text-sm text-slate-400">
            Mix Twitch and YouTube streams together seamlessly
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-semibold text-white mb-2">Responsive Grid</h3>
          <p className="text-sm text-slate-400">
            Automatically adapts layout to your screen size
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <div className="text-3xl mb-3">🎬</div>
          <h3 className="font-semibold text-white mb-2">Fullscreen View</h3>
          <p className="text-sm text-slate-400">
            Click expand to view any stream in fullscreen
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <div className="text-3xl mb-3">💾</div>
          <h3 className="font-semibold text-white mb-2">Save Presets</h3>
          <p className="text-sm text-slate-400">
            Save and load your favorite stream combinations
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <div className="text-3xl mb-3">📱</div>
          <h3 className="font-semibold text-white mb-2">Responsive</h3>
          <p className="text-sm text-slate-400">
            Works perfectly on desktop, tablet, and mobile
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
