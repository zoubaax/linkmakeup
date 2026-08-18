import { useEffect, useRef, useState } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';

export default function AdminRowActions({ items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="Row actions"
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
      >
        <HiEllipsisVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-surface shadow-xl py-1 z-20">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className={`w-full px-3 py-2 text-left text-xs font-semibold transition-colors disabled:opacity-40 ${
                item.tone === 'danger'
                  ? 'text-red-600 hover:bg-red-500/10'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-alt'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
