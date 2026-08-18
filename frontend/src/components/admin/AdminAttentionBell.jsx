import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBell } from 'react-icons/hi2';
import { useAdmin } from '../../contexts/AdminContext';
import ApiService from '../../services/api';

export default function AdminAttentionBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { attentionItems, setAttentionItems } = useAdmin();

  const totalCount = attentionItems.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    ApiService.getAdminStats()
      .then((res) => {
        if (!cancelled && res.success) {
          setAttentionItems(res.data.attentionItems || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [setAttentionItems]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Attention items"
        className="relative p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
      >
        <HiBell className="w-4 h-4" />
        {totalCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-surface" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-border/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-border/80">
            <p className="text-xs font-bold text-fg">Needs attention</p>
            <p className="text-[11px] text-fg-muted mt-0.5">Actionable platform items</p>
          </div>

          {loading ? (
            <p className="px-4 py-6 text-xs text-fg-muted text-center">Loading…</p>
          ) : attentionItems.length === 0 ? (
            <p className="px-4 py-6 text-xs text-fg-muted text-center">All clear — nothing urgent</p>
          ) : (
            <ul className="py-1">
              {attentionItems.map((item) => (
                <li key={item.type}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs hover:bg-surface-alt transition-colors"
                  >
                    <span className="font-semibold text-fg">{item.label}</span>
                    <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold tabular-nums">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
