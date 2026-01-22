/**
 * Custom hook for keyboard shortcuts
 * Provides common shortcuts for stream theater controls
 */

'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onToggleChat?: () => void;
  onToggleCinemaMode?: () => void;
  onClose?: () => void;
  onSizeSmall?: () => void;
  onSizeMedium?: () => void;
  onSizeLarge?: () => void;
}

/**
 * Keyboard shortcuts:
 * T - Toggle chat
 * C - Toggle cinema mode
 * Esc - Close stream
 * S - Small size
 * M - Medium size
 * L - Large size
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true';

      if (isInput) {
        return;
      }

      // Keyboard shortcuts (case-insensitive)
      const key = event.key.toLowerCase();

      switch (key) {
        case 't':
          // Toggle chat
          event.preventDefault();
          config.onToggleChat?.();
          break;

        case 'c':
          // Toggle cinema mode
          event.preventDefault();
          config.onToggleCinemaMode?.();
          break;

        case 'escape':
          // Close stream
          event.preventDefault();
          config.onClose?.();
          break;

        case 's':
          // Small size
          event.preventDefault();
          config.onSizeSmall?.();
          break;

        case 'm':
          // Medium size
          event.preventDefault();
          config.onSizeMedium?.();
          break;

        case 'l':
          // Large size
          event.preventDefault();
          config.onSizeLarge?.();
          break;

        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);
}
