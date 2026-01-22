/**
 * StreamInput Component
 * Compact input for adding streams
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseStreamInput } from '@/lib/stream-parser';
import { Play, AlertCircle, X } from 'lucide-react';

interface StreamInputProps {
  onStreamSubmit: (input: string) => void;
  isLoading?: boolean;
  onClose?: () => void;
}

export function StreamInput({ onStreamSubmit, isLoading = false, onClose }: StreamInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<string>('');

  /**
   * Handle input change and detect platform in real-time
   */
  const handleInputChange = (value: string) => {
    setInput(value);
    setError('');

    // Detect platform as user types
    if (value.trim()) {
      const parsed = parseStreamInput(value);
      if (parsed) {
        setDetectedPlatform(parsed.platform === 'twitch' ? '🟣 Twitch' : '🔴 YouTube');
      } else {
        setDetectedPlatform('');
      }
    } else {
      setDetectedPlatform('');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please enter a stream URL or channel name');
      return;
    }

    const parsed = parseStreamInput(input);
    if (!parsed) {
      setError('Invalid stream URL or channel name. Try: twitch.tv/channelname or @youtubechannel');
      return;
    }

    onStreamSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Input
          type="text"
          placeholder="Paste Twitch/YouTube URL or enter channel name..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isLoading}
          className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-500 pr-24 h-12 backdrop-blur-sm"
        />
        {/* Platform detection badge */}
        {detectedPlatform && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-300 bg-slate-700/50 px-2 py-1 rounded">
            {detectedPlatform}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit button */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12 rounded-lg transition-all duration-200"
        >
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading...' : 'Load Stream'}
        </Button>
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </form>
  );
}
