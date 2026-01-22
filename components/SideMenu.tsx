/**
 * SideMenu Component
 * Collapsible side menu with stream management features
 * Includes: add streams, mute all, resolution control, save/load presets, etc.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Menu,
  X,
  Plus,
  Volume2,
  VolumeX,
  Settings,
  Save,
  Download,
  Trash2,
  Grid3x3,
  Maximize2,
} from 'lucide-react';
import { StreamData } from '@/lib/types';

interface SideMenuProps {
  streams: StreamData[];
  gridColumns: number;
  onAddStream: (input: string) => void;
  onRemoveStream: (streamId: string) => void;
  onClearAll: () => void;
  onGridColumnsChange: (columns: number) => void;
  onSavePreset: (name: string) => void;
  onLoadPreset: (name: string) => void;
  savedPresets: { name: string; streams: StreamData[] }[];
}

export function SideMenu({
  streams,
  gridColumns,
  onAddStream,
  onRemoveStream,
  onClearAll,
  onGridColumnsChange,
  onSavePreset,
  onLoadPreset,
  savedPresets,
}: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newStreamInput, setNewStreamInput] = useState('');
  const [presetName, setPresetName] = useState('');
  const [allMuted, setAllMuted] = useState(false);

  /**
   * Handle adding a new stream
   */
  const handleAddStream = () => {
    if (newStreamInput.trim()) {
      onAddStream(newStreamInput);
      setNewStreamInput('');
    }
  };

  /**
   * Handle saving current streams as preset
   */
  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName);
      setPresetName('');
    }
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        title="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Side menu */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 bg-slate-900 border-r border-slate-700 shadow-2xl transition-transform duration-300 ease-out z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu header */}
        <div className="sticky top-0 bg-slate-800/50 border-b border-slate-700 p-4 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Stream Control
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {streams.length} stream{streams.length !== 1 ? 's' : ''} active
          </p>
        </div>

        {/* Menu content */}
        <div className="p-4 space-y-4">
          {/* Add Stream Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Stream
            </h3>
            <Input
              type="text"
              placeholder="Channel name or URL"
              value={newStreamInput}
              onChange={(e) => setNewStreamInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStream()}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={handleAddStream}
              disabled={!newStreamInput.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Stream
            </Button>
          </div>

          {/* Grid Layout Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Grid Layout
            </h3>
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((col) => (
                <Button
                  key={col}
                  onClick={() => onGridColumnsChange(col)}
                  variant={gridColumns === col ? 'default' : 'outline'}
                  size="sm"
                  className={`${
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

          {/* Audio Control Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio Control
            </h3>
            <Button
              onClick={() => setAllMuted(!allMuted)}
              className={`w-full ${
                allMuted
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              } text-white`}
            >
              {allMuted ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  All Muted
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Mute All
                </>
              )}
            </Button>
            <p className="text-xs text-slate-400">
              {allMuted ? 'All streams muted' : 'Click to mute all streams'}
            </p>
          </div>

          {/* Resolution Control Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Resolution
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['720p', '1080p', '1440p', '4K'].map((res) => (
                <Button
                  key={res}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  {res}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Note: Resolution depends on stream availability
            </p>
          </div>

          {/* Save Preset Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Preset
            </h3>
            <Input
              type="text"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={handleSavePreset}
              disabled={!presetName.trim() || streams.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Current Setup
            </Button>
          </div>

          {/* Load Preset Section */}
          {savedPresets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Download className="w-4 h-4" />
                Load Preset
              </h3>
              <div className="space-y-2">
                {savedPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    onClick={() => onLoadPreset(preset.name)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    {preset.name}
                    <span className="ml-auto text-xs text-slate-500">
                      {preset.streams.length}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Active Streams Section */}
          {streams.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Active Streams</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {streams.map((stream) => (
                  <Card
                    key={stream.id}
                    className="bg-slate-800 border-slate-700 p-2 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {stream.channelName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {stream.platform === 'twitch' ? '🟣 Twitch' : '🔴 YouTube'}
                      </p>
                    </div>
                    <Button
                      onClick={() => onRemoveStream(stream.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-950/30"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Clear All Section */}
          {streams.length > 0 && (
            <Button
              onClick={onClearAll}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Streams
            </Button>
          )}

          {/* Info Section */}
          <Card className="bg-slate-800/50 border-slate-700 p-3">
            <p className="text-xs text-slate-400">
              <strong>Tip:</strong> Use presets to quickly load your favorite stream
              combinations!
            </p>
          </Card>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
