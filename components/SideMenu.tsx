/**
 * SideMenu Component
 * Draggable side menu with stream management features
 */

'use client';

import { useState, useRef, useEffect } from 'react';
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
  GripHorizontal,
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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  isOpen,
  onOpenChange,
}: SideMenuProps) {
  const [newStreamInput, setNewStreamInput] = useState('');
  const [presetName, setPresetName] = useState('');
  const [allMuted, setAllMuted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Handle mouse down on drag handle
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!menuRef.current) return;
    setIsDragging(true);
    const rect = menuRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  /**
   * Handle mouse move for dragging
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
        onClick={() => onOpenChange(!isOpen)}
        className="fixed right-4 top-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        title="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Side menu - draggable */}
      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 40,
          }}
          className="w-80 max-h-[90vh] bg-slate-900/95 border border-slate-700 shadow-2xl rounded-lg overflow-hidden backdrop-blur-md flex flex-col"
        >
          {/* Drag handle header */}
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center gap-2 bg-slate-800/50 border-b border-slate-700 p-4 cursor-grab active:cursor-grabbing"
          >
            <GripHorizontal className="w-4 h-4 text-slate-500" />
            <h2 className="text-lg font-bold text-white flex-1">Stream Control</h2>
            <p className="text-xs text-slate-400">
              {streams.length} stream{streams.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 h-9"
              />
              <Button
                onClick={handleAddStream}
                disabled={!newStreamInput.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-9"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
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
                    className={`h-8 ${
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
                Audio
              </h3>
              <Button
                onClick={() => setAllMuted(!allMuted)}
                className={`w-full h-9 ${
                  allMuted
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                } text-white`}
              >
                {allMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Unmute All
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Mute All
                  </>
                )}
              </Button>
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
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 h-9"
              />
              <Button
                onClick={handleSavePreset}
                disabled={!presetName.trim() || streams.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-9"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Setup
              </Button>
            </div>

            {/* Load Preset Section */}
            {savedPresets.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Presets
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => onLoadPreset(preset.name)}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800 h-8"
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
                <div className="space-y-2 max-h-40 overflow-y-auto">
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
                        className="text-red-400 hover:bg-red-950/30 h-7 w-7 p-0"
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
                className="w-full bg-red-600 hover:bg-red-700 text-white h-9"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}

            {/* Info Section */}
            <Card className="bg-slate-800/50 border-slate-700 p-3">
              <p className="text-xs text-slate-400">
                <strong>Tip:</strong> Drag this menu to move it around. Use presets to quickly load your favorite stream combinations!
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
    </>
  );
}
