/**
 * Type definitions for Stream Theater application
 * Handles platform detection, stream data, and UI state
 */

export type Platform = 'twitch' | 'youtube' | 'unknown';

export interface StreamData {
  id: string; // Unique ID for each stream in multi-view
  platform: Platform;
  channelId: string;
  channelName: string;
  isLive: boolean;
  url: string;
}

export interface AppState {
  streams: StreamData[]; // Array of streams for multi-view
  viewMode: 'single' | 'multi'; // Single stream or multi-stream view
  selectedStreamId: string | null; // Currently selected stream in single view
  showChat: boolean;
  cinemaMode: boolean;
  videoSize: 'small' | 'medium' | 'large' | 'fullscreen';
  lastStreams: StreamData[]; // History of last streams
  gridColumns: number; // Number of columns in grid view (2, 3, 4, 5)
}

export interface ParsedStreamInput {
  platform: Platform;
  channelId: string;
  channelName: string;
}
