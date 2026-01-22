/**
 * Stream Theater state management
 *
 * Key ideas:
 * - Everything is persisted in localStorage for a "works everywhere" experience.
 * - We keep the embedding layer simple (iframes) for cross-browser compatibility.
 * - Global controls (mute, layout auto, docked panel) are state-driven.
 */

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppState, PanelMode, StreamData } from '@/lib/types'
import { parseStreamInput } from '@/lib/stream-parser'

const STORAGE_KEY = 'stream-theater-state'
const PRESETS_KEY = 'stream-theater-presets'

function generateStreamId(): string {
  return `stream-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return {
      streams: [],
      viewMode: 'multi',
      selectedStreamId: null,
      gridColumns: 2,
      layoutAuto: true,
      muteAll: true,
      panel: {
        mode: 'docked-right',
        x: 24,
        y: 80,
        width: 340,
      },
      lastStreams: [],
      showChat: false,
      cinemaMode: false,
      videoSize: 'large',
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as AppState
  } catch {
    // ignore
  }

  return {
    streams: [],
    viewMode: 'multi',
    selectedStreamId: null,
    gridColumns: 2,
    layoutAuto: true,
    muteAll: true,
    panel: {
      mode: 'docked-right',
      x: 24,
      y: 80,
      width: 340,
    },
    lastStreams: [],
    showChat: false,
    cinemaMode: false,
    videoSize: 'large',
  }
}

function getInitialPresets(): { name: string; streams: StreamData[] }[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(PRESETS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }
  return []
}

export function useStreamTheater() {
  const [state, setState] = useState<AppState>(getInitialState())
  const [presets, setPresets] = useState<{ name: string; streams: StreamData[] }[]>(getInitialPresets())
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => setIsHydrated(true), [])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
    } catch {
      // ignore
    }
  }, [presets, isHydrated])

  const addStream = useCallback((input: string) => {
    const parsed = parseStreamInput(input)
    if (!parsed) return false

    const newStream: StreamData = {
      id: generateStreamId(),
      platform: parsed.platform,
      channelId: parsed.channelId,
      channelName: parsed.channelName,
      isLive: true,
      url: input,
    }

    setState((prev) => ({
      ...prev,
      streams: [...prev.streams, newStream],
      lastStreams: [newStream, ...prev.lastStreams.slice(0, 9)],
    }))

    return true
  }, [])

  const removeStream = useCallback((streamId: string) => {
    setState((prev) => ({
      ...prev,
      streams: prev.streams.filter((s) => s.id !== streamId),
      selectedStreamId: prev.selectedStreamId === streamId ? null : prev.selectedStreamId,
      viewMode: prev.selectedStreamId === streamId ? 'multi' : prev.viewMode,
    }))
  }, [])

  const clearAllStreams = useCallback(() => {
    setState((prev) => ({
      ...prev,
      streams: [],
      selectedStreamId: null,
      viewMode: 'multi',
    }))
  }, [])

  const selectStream = useCallback((streamId: string) => {
    setState((prev) => ({
      ...prev,
      selectedStreamId: streamId,
      viewMode: 'single',
    }))
  }, [])

  const switchToMultiView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      viewMode: 'multi',
      selectedStreamId: null,
    }))
  }, [])

  const setGridColumns = useCallback((columns: number) => {
    setState((prev) => ({
      ...prev,
      gridColumns: Math.max(1, Math.min(5, columns)),
      layoutAuto: false,
    }))
  }, [])

  const setLayoutAuto = useCallback((auto: boolean) => {
    setState((prev) => ({
      ...prev,
      layoutAuto: auto,
    }))
  }, [])

  const setMuteAll = useCallback((mute: boolean) => {
    setState((prev) => ({
      ...prev,
      muteAll: mute,
    }))
  }, [])

  const setPanelMode = useCallback((mode: PanelMode) => {
    setState((prev) => ({
      ...prev,
      panel: {
        ...prev.panel,
        mode,
      },
    }))
  }, [])

  const setPanelPosition = useCallback((x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      panel: {
        ...prev.panel,
        x,
        y,
      },
    }))
  }, [])

  const setPanelWidth = useCallback((width: number) => {
    setState((prev) => ({
      ...prev,
      panel: {
        ...prev.panel,
        width: Math.max(280, Math.min(480, width)),
      },
    }))
  }, [])

  const loadFromHistory = useCallback((stream: StreamData) => {
    const newStream: StreamData = { ...stream, id: generateStreamId() }
    setState((prev) => ({ ...prev, streams: [...prev.streams, newStream] }))
    return true
  }, [])

  const savePreset = useCallback(
    (name: string) => {
      if (!name.trim() || state.streams.length === 0) return false
      setPresets((prev) => {
        const filtered = prev.filter((p) => p.name !== name)
        return [...filtered, { name, streams: state.streams }]
      })
      return true
    },
    [state.streams]
  )

  const loadPreset = useCallback(
    (name: string) => {
      const preset = presets.find((p) => p.name === name)
      if (!preset) return false
      const newStreams = preset.streams.map((s) => ({ ...s, id: generateStreamId() }))
      setState((prev) => ({ ...prev, streams: newStreams, viewMode: 'multi', selectedStreamId: null }))
      return true
    },
    [presets]
  )

  const deletePreset = useCallback((name: string) => {
    setPresets((prev) => prev.filter((p) => p.name !== name))
    return true
  }, [])

  // Derived: effective columns based on stream count (when auto)
  const effectiveColumns = useMemo(() => {
    if (!state.layoutAuto) return state.gridColumns
    const n = state.streams.length
    if (n <= 1) return 1
    if (n <= 4) return 2
    if (n <= 9) return 3
    return 4
  }, [state.gridColumns, state.layoutAuto, state.streams.length])

  return {
    // state
    streams: state.streams,
    viewMode: state.viewMode,
    selectedStreamId: state.selectedStreamId,
    gridColumns: state.gridColumns,
    effectiveColumns,
    layoutAuto: state.layoutAuto,
    muteAll: state.muteAll,
    panel: state.panel,
    lastStreams: state.lastStreams,
    presets,
    isHydrated,

    // actions
    addStream,
    removeStream,
    clearAllStreams,
    selectStream,
    switchToMultiView,
    setGridColumns,
    setLayoutAuto,
    setMuteAll,
    setPanelMode,
    setPanelPosition,
    setPanelWidth,
    loadFromHistory,
    savePreset,
    loadPreset,
    deletePreset,
  }
}
