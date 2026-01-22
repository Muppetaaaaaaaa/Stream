export interface StreamData {
  id: string
  platform: 'twitch' | 'youtube'
  channelId: string
  channelName: string
  isLive?: boolean
  url?: string
}

export type PanelMode = 'docked-left' | 'docked-right' | 'floating' | 'hidden'

export interface PanelState {
  mode: PanelMode
  width: number
  x: number
  y: number
}

export interface AppState {
  streams: StreamData[]
  viewMode: 'multi' | 'single'
  selectedStreamId: string | null
  gridColumns: number
  layoutAuto: boolean
  muteAll: boolean
  panel: PanelState
  lastStreams: StreamData[]
  showChat: boolean
  cinemaMode: boolean
  videoSize: 'small' | 'medium' | 'large'
}

export interface AppSettings {
  hideChat: boolean
  autoplayAudio: boolean
  streamQuality: 'auto' | '720p' | '480p' | '360p'
  showNotifications: boolean
  muteOnLoad: boolean
  rememberLayout: boolean
  compactMode: boolean
  darkMode: boolean
}

export type Platform = 'twitch' | 'youtube'

export interface ParsedStreamInput {
  platform: Platform
  channelId: string
  channelName: string
}
