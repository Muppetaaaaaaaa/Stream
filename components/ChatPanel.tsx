/**
 * ChatPanel Component
 * Embeds official Twitch or YouTube chat with smooth animations
 * Can be toggled on/off with smooth slide animation
 */

'use client';

import { StreamData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface ChatPanelProps {
  stream: StreamData;
  isVisible: boolean;
  onToggle: () => void;
}

/**
 * Render Twitch chat embed
 */
function TwitchChat({ channelId }: { channelId: string }) {
  return (
    <iframe
      src={`https://www.twitch.tv/embed/${channelId}/chat?parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
      height="100%"
      width="100%"
      className="rounded-lg"
      title={`Twitch Chat - ${channelId}`}
    />
  );
}

/**
 * Render YouTube Live chat embed
 * Note: YouTube Live chat requires the stream to be live
 */
function YouTubeChat({ channelId }: { channelId: string }) {
  const cleanId = channelId.replace('@', '');

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center">
      <MessageCircle className="w-12 h-12 text-slate-600 mb-4" />
      <p className="text-slate-400 text-sm text-center px-4">
        YouTube Live chat is available when the stream is live. Visit the channel to participate.
      </p>
      <a
        href={`https://www.youtube.com/@${cleanId}/live`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Open on YouTube
      </a>
    </div>
  );
}

export function ChatPanel({ stream, isVisible, onToggle }: ChatPanelProps) {
  return (
    <>
      {/* Chat toggle button - always visible */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-40 bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 backdrop-blur-sm"
        title="Toggle chat (T)"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {isVisible ? 'Hide Chat' : 'Show Chat'}
      </Button>

      {/* Chat panel with smooth slide animation */}
      <div
        className={`fixed right-0 top-0 h-screen w-80 bg-slate-900 border-l border-slate-700 shadow-2xl transition-transform duration-300 ease-out z-30 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-white">
              {stream.platform === 'twitch' ? 'Twitch Chat' : 'YouTube Chat'}
            </span>
          </div>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Chat content */}
        <div className="w-full h-[calc(100vh-60px)]">
          {stream.platform === 'twitch' ? (
            <TwitchChat channelId={stream.channelId} />
          ) : (
            <YouTubeChat channelId={stream.channelId} />
          )}
        </div>
      </div>

      {/* Overlay when chat is visible - click to close */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={onToggle}
          title="Click to close chat"
        />
      )}
    </>
  );
}
