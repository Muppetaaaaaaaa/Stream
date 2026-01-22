/**
 * EmbedNotice
 *
 * We can't reliably detect 3rd-party cookie blocking in all browsers.
 * But we can give users a clear explanation and next steps.
 */

'use client'

import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmbedNoticeProps {
  platform: 'twitch' | 'youtube'
  url: string
  onDismiss?: () => void
}

export function EmbedNotice({ platform, url, onDismiss }: EmbedNoticeProps) {
  const title = platform === 'twitch' ? 'Twitch embed may be blocked' : 'YouTube embed may be blocked'

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-50">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm text-amber-100/90">
            Some browsers (Brave, Opera, and privacy-focused setups) may block embedded players due to strict
            tracking/3rd‑party cookie settings. We’re actively working on a more reliable workaround.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" className="bg-amber-500 text-black hover:bg-amber-400">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in new tab
              </a>
            </Button>
            {onDismiss && (
              <Button
                size="sm"
                variant="outline"
                className="border-amber-500/40 bg-transparent text-amber-100 hover:bg-amber-500/10"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            )}
          </div>
          <p className="mt-3 text-xs text-amber-100/80">
            Tip: In Brave, click the lion icon → lower Shields for this site (or allow cookies for twitch.tv / youtube.com).
          </p>
        </div>
      </div>
    </div>
  )
}
