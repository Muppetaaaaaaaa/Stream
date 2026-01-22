/**
 * StreamInput Component
 * Allows users to paste a Twitch/YouTube URL or enter a channel name
 * Provides visual feedback for platform detection
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { parseStreamInput } from '@/lib/stream-parser';
import { Play, AlertCircle } from 'lucide-react';

interface StreamInputProps {
  onStreamSubmit: (input: string) => void;
  isLoading?: boolean;
}

export function StreamInput({ onStreamSubmit, isLoading = false }: StreamInputProps) {
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
    <Card className="w-full max-w-2xl mx-auto p-6 bg-slate-900/50 border-slate-700 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input field with platform detection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Stream URL or Channel Name
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Paste Twitch/YouTube URL or enter channel name (e.g., @channelname or twitch.tv/channel)"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 pr-32"
            />
            {/* Platform detection badge */}
            {detectedPlatform && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-300 bg-slate-700/50 px-2 py-1 rounded">
                {detectedPlatform}
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
        >
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading Stream...' : 'Load Stream'}
        </Button>

        {/* Help text */}
        <p className="text-xs text-slate-400 text-center">
          Supports Twitch and YouTube livestreams. Paste a URL or enter a channel name.
        </p>
      </form>
    </Card>
  );
}
