/**
 * Stream Parser - Detects platform and extracts channel information
 * Supports multiple URL formats for both Twitch and YouTube
 */

import { Platform, ParsedStreamInput } from './types';

/**
 * Detects if a URL or string is a Twitch stream
 * Supports: twitch.tv/channel, twitch.tv/videos/123, clips, etc.
 */
function isTwitchUrl(input: string): boolean {
  return /twitch\.tv/i.test(input);
}

/**
 * Detects if a URL or string is a YouTube stream
 * Supports: youtube.com, youtu.be, youtube.com/@channel, youtube.com/c/channel, etc.
 */
function isYouTubeUrl(input: string): boolean {
  return /(youtube\.com|youtu\.be)/i.test(input);
}

/**
 * Extracts Twitch channel name from various URL formats
 * Examples:
 * - https://twitch.tv/channelname -> channelname
 * - channelname -> channelname
 * - https://twitch.tv/videos/123 -> null (not a channel)
 */
function extractTwitchChannel(input: string): string | null {
  // Remove protocol and www
  const cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '');

  // Match twitch.tv/channelname pattern
  const match = cleaned.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
  if (match) {
    return match[1].toLowerCase();
  }

  // If it's just a channel name (no URL)
  if (!input.includes('/') && !input.includes('.')) {
    return input.toLowerCase();
  }

  return null;
}

/**
 * Extracts YouTube channel ID or handle from various URL formats
 * Examples:
 * - https://youtube.com/@channelname -> @channelname
 * - https://youtube.com/c/channelname -> channelname
 * - https://youtube.com/channel/UCxxxxxx -> UCxxxxxx
 * - @channelname -> @channelname
 */
function extractYouTubeChannel(input: string): string | null {
  // Remove protocol
  const cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '');

  // Match @handle format (modern YouTube)
  const handleMatch = cleaned.match(/@([a-zA-Z0-9_-]+)/);
  if (handleMatch) {
    return `@${handleMatch[1]}`;
  }

  // Match /c/channelname format
  const cMatch = cleaned.match(/\/c\/([a-zA-Z0-9_-]+)/i);
  if (cMatch) {
    return cMatch[1];
  }

  // Match /channel/UCxxxxxx format
  const channelMatch = cleaned.match(/\/channel\/(UC[a-zA-Z0-9_-]+)/i);
  if (channelMatch) {
    return channelMatch[1];
  }

  // Match /user/username format (legacy)
  const userMatch = cleaned.match(/\/user\/([a-zA-Z0-9_-]+)/i);
  if (userMatch) {
    return userMatch[1];
  }

  // If it's just a handle or channel name
  if (!input.includes('/') && !input.includes('.')) {
    return input.startsWith('@') ? input : `@${input}`;
  }

  return null;
}

/**
 * Main parser function - detects platform and extracts channel info
 * @param input - URL or channel name
 * @returns Parsed stream data with platform and channel info
 */
export function parseStreamInput(input: string): ParsedStreamInput | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();

  // Detect Twitch
  if (isTwitchUrl(trimmed)) {
    const channel = extractTwitchChannel(trimmed);
    if (channel) {
      return {
        platform: 'twitch',
        channelId: channel,
        channelName: channel,
      };
    }
  }

  // Detect YouTube
  if (isYouTubeUrl(trimmed)) {
    const channel = extractYouTubeChannel(trimmed);
    if (channel) {
      return {
        platform: 'youtube',
        channelId: channel,
        channelName: channel,
      };
    }
  }

  // Try to detect platform from plain channel name
  // If it looks like a YouTube handle (@something), treat as YouTube
  if (trimmed.startsWith('@')) {
    return {
      platform: 'youtube',
      channelId: trimmed,
      channelName: trimmed,
    };
  }

  // Otherwise assume Twitch for plain channel names
  if (trimmed && !trimmed.includes('/') && !trimmed.includes('.')) {
    return {
      platform: 'twitch',
      channelId: trimmed.toLowerCase(),
      channelName: trimmed.toLowerCase(),
    };
  }

  return null;
}

/**
 * Generates the embed URL for a given platform and channel
 * @param platform - 'twitch' or 'youtube'
 * @param channelId - Channel identifier
 * @returns Embed URL for the player
 */
export function getEmbedUrl(platform: Platform, channelId: string): string {
  if (platform === 'twitch') {
    // Twitch embed URL for live streams
    return `https://twitch.tv/embed/${channelId}/chat?parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
  } else if (platform === 'youtube') {
    // YouTube embed URL - handles both @handle and channel ID formats
    const cleanId = channelId.replace('@', '');
    return `https://www.youtube.com/@${cleanId}`;
  }

  return '';
}

/**
 * Generates the chat embed URL for a given platform
 * @param platform - 'twitch' or 'youtube'
 * @param channelId - Channel identifier
 * @returns Chat embed URL
 */
export function getChatEmbedUrl(platform: Platform, channelId: string): string {
  if (platform === 'twitch') {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `https://www.twitch.tv/embed/${channelId}/chat?parent=${hostname}`;
  } else if (platform === 'youtube') {
    // YouTube Live chat is embedded differently - we'll use an iframe approach
    const cleanId = channelId.replace('@', '');
    return `https://www.youtube.com/@${cleanId}/live`;
  }

  return '';
}

/**
 * Generates the direct player embed URL (without chat)
 * Used for multi-stream view
 */
export function getPlayerEmbedUrl(platform: Platform, channelId: string): string {
  if (platform === 'twitch') {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `https://player.twitch.tv/?channel=${channelId}&parent=${hostname}`;
  } else if (platform === 'youtube') {
    const cleanId = channelId.replace('@', '');
    return `https://www.youtube.com/embed/@${cleanId}/live`;
  }

  return '';
}
