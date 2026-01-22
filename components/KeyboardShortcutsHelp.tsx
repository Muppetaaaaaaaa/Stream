/**
 * KeyboardShortcutsHelp Component
 * Displays available keyboard shortcuts in a modal
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'T', description: 'Toggle chat panel' },
    { key: 'C', description: 'Toggle cinema mode' },
    { key: 'Esc', description: 'Close stream' },
    { key: 'S', description: 'Small video size' },
    { key: 'M', description: 'Medium video size' },
    { key: 'L', description: 'Large video size' },
  ];

  return (
    <>
      {/* Help button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 left-6 z-40 bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 backdrop-blur-sm"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4 mr-2" />
        Help
      </Button>

      {/* Shortcuts modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <span className="text-sm text-slate-300">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs font-semibold text-white">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            Shortcuts are disabled when typing in input fields
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
