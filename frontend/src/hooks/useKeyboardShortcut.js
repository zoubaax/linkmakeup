import { useEffect, useCallback } from 'react';

export function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrl = false, meta = false, shift = false } = options;

  const handler = useCallback(
    (event) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const modMatch =
        (ctrl ? event.ctrlKey : true) &&
        (meta ? event.metaKey : true) &&
        (shift ? event.shiftKey : !event.shiftKey);

      if (keyMatch && modMatch && (ctrl || meta || !event.ctrlKey && !event.metaKey)) {
        if (ctrl && !event.ctrlKey) return;
        if (meta && !event.metaKey) return;
        event.preventDefault();
        callback(event);
      }
    },
    [key, callback, ctrl, meta, shift],
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}

export function useCommandPaletteShortcut(onOpen) {
  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpen]);
}
