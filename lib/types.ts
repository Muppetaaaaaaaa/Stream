/**
 * Type definitions for Stream Theater application
 *
 * Notes:
 * - We intentionally avoid cross-origin JS control of the embedded players for maximum browser compatibility.
 * - Global actions like "Mute All" are implemented by re-rendering iframes with platform-supported query params.
 */

export type Platform = 'twitch' | 'youtube' | 'unknown'

export type ViewMode = 'single' | 'multi'

export type PanelMode = 'hidden' | 'floating' | 'docked-left' | 'docked-right'

export interface StreamData {
  /** Unique ID for each stream in multi-view */
  id: string
  platform: Platform
  channelId: string
  channelName: string
  isLive: boolean
  url: string
}

export interface PanelState {
  mode: PanelMode
  /** Used only when mode === 'floating' */
  x: number
  y: number
  /** Used only when mode is docked */
  width: number
}

export interface AppState {
  /** Array of streams for multi-view */
  streams: StreamData[]

  /** Single stream or multi-stream view */
  viewMode: ViewMode

  /** Currently selected stream in single view */
  selectedStreamId: string | null

  /** Grid columns (manual override). If layoutAuto=true, we ignore this and compute columns from stream count */
  gridColumns: number

  /** If true, the grid auto-selects an appropriate number of columns based on stream count */
  layoutAuto: boolean

  /** Global mute toggle implemented by re-rendering embeds with muted params */
  muteAll: boolean

  /** Side panel state */
  panel: PanelState

  /** History of last streams */
  lastStreams: StreamData[]

  /** Legacy fields we may re-add later (chat/cinema) */
  showChat: boolean
  cinemaMode: boolean
  videoSize: 'small' | 'medium' | 'large' | 'fullscreen'
}

export interface ParsedStreamInput {
  platform: Platform
  channelId: string
  channelName: string
}
