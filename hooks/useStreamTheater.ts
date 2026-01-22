/**
 * Custom hook for Stream Theater state management
 * Handles multiple streams, presets, and local storage persistence
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { StreamData, AppState } from '@/lib/types';
import { parseStreamInput } from '@/lib/stream-parser';

const STORAGE_KEY = 'stream-theater-state';
const PRESETS_KEY = 'stream-theater-presets';

/**
 * Generate unique ID for each stream
 */
function generateStreamId(): string {
  return `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Initialize state from localStorage or use defaults
 */
function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return {
      streams: [],
      viewMode: 'multi',
      selectedStreamId: null,
      showChat: false,
      cinemaMode: false,
      videoSize: 'large',
      lastStreams: [],
      gridColumns: 2,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }

  return {
    streams: [],
    viewMode: 'multi',
    selectedStreamId: null,
    showChat: false,
    cinemaMode: false,
    videoSize: 'large',
    lastStreams: [],
    gridColumns: 2,
  };
}

/**
 * Load presets from localStorage
 */
function getInitialPresets(): { name: string; streams: StreamData[] }[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(PRESETS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load presets from localStorage:', error);
  }

  return [];
}

export function useStreamTheater() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [presets, setPresets] = useState<{ name: string; streams: StreamData[] }[]>(
    getInitialPresets()
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    }
  }, [state, isHydrated]);

  // Persist presets to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
      } catch (error) {
        console.error('Failed to save presets to localStorage:', error);
      }
    }
  }, [presets, isHydrated]);

  /**
   * Add a new stream to the multi-view
   */
  const addStream = useCallback((input: string) => {
    const parsed = parseStreamInput(input);
    if (!parsed) {
      console.error('Invalid stream input:', input);
      return false;
    }

    const newStream: StreamData = {
      id: generateStreamId(),
      platform: parsed.platform,
      channelId: parsed.channelId,
      channelName: parsed.channelName,
      isLive: true,
      url: input,
    };

    setState((prev) => ({
      ...prev,
      streams: [...prev.streams, newStream],
      lastStreams: [newStream, ...prev.lastStreams.slice(0, 9)],
    }));

    return true;
  }, []);

  /**
   * Remove a stream from the multi-view
   */
  const removeStream = useCallback((streamId: string) => {
    setState((prev) => ({
      ...prev,
      streams: prev.streams.filter((s) => s.id !== streamId),
      selectedStreamId:
        prev.selectedStreamId === streamId ? null : prev.selectedStreamId,
    }));
  }, []);

  /**
   * Clear all streams
   */
  const clearAllStreams = useCallback(() => {
    setState((prev) => ({
      ...prev,
      streams: [],
      selectedStreamId: null,
    }));
  }, []);

  /**
   * Select a stream for single-view mode
   */
  const selectStream = useCallback((streamId: string) => {
    setState((prev) => ({
      ...prev,
      selectedStreamId: streamId,
      viewMode: 'single',
    }));
  }, []);

  /**
   * Switch to multi-view mode
   */
  const switchToMultiView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      viewMode: 'multi',
      selectedStreamId: null,
    }));
  }, []);

  /**
   * Toggle chat visibility
   */
  const toggleChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showChat: !prev.showChat,
    }));
  }, []);

  /**
   * Toggle cinema mode
   */
  const toggleCinemaMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cinemaMode: !prev.cinemaMode,
    }));
  }, []);

  /**
   * Change video size
   */
  const setVideoSize = useCallback(
    (size: 'small' | 'medium' | 'large' | 'fullscreen') => {
      setState((prev) => ({
        ...prev,
        videoSize: size,
      }));
    },
    []
  );

  /**
   * Change grid columns for multi-view
   */
  const setGridColumns = useCallback((columns: number) => {
    setState((prev) => ({
      ...prev,
      gridColumns: Math.max(1, Math.min(5, columns)),
    }));
  }, []);

  /**
   * Load a stream from history
   */
  const loadFromHistory = useCallback((stream: StreamData) => {
    const newStream: StreamData = {
      ...stream,
      id: generateStreamId(),
    };

    setState((prev) => ({
      ...prev,
      streams: [...prev.streams, newStream],
    }));

    return true;
  }, []);

  /**
   * Save current streams as a preset
   */
  const savePreset = useCallback((name: string) => {
    if (!name.trim() || state.streams.length === 0) {
      return false;
    }

    setPresets((prev) => {
      // Remove existing preset with same name
      const filtered = prev.filter((p) => p.name !== name);
      // Add new preset
      return [...filtered, { name, streams: state.streams }];
    });

    return true;
  }, [state.streams]);

  /**
   * Load a preset
   */
  const loadPreset = useCallback((name: string) => {
    const preset = presets.find((p) => p.name === name);
    if (!preset) {
      return false;
    }

    // Create new stream instances from preset
    const newStreams = preset.streams.map((stream) => ({
      ...stream,
      id: generateStreamId(),
    }));

    setState((prev) => ({
      ...prev,
      streams: newStreams,
    }));

    return true;
  }, [presets]);

  /**
   * Delete a preset
   */
  const deletePreset = useCallback((name: string) => {
    setPresets((prev) => prev.filter((p) => p.name !== name));
    return true;
  }, []);

  return {
    // State
    streams: state.streams,
    viewMode: state.viewMode,
    selectedStreamId: state.selectedStreamId,
    showChat: state.showChat,
    cinemaMode: state.cinemaMode,
    videoSize: state.videoSize,
    lastStreams: state.lastStreams,
    gridColumns: state.gridColumns,
    presets,
    isHydrated,

    // Actions
    addStream,
    removeStream,
    clearAllStreams,
    selectStream,
    switchToMultiView,
    toggleChat,
    toggleCinemaMode,
    setVideoSize,
    setGridColumns,
    loadFromHistory,
    savePreset,
    loadPreset,
    deletePreset,
  };
}
