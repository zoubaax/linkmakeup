import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GO_ROUTES = {
  o: '/admin',
  u: '/admin/users',
  p: '/admin/profiles',
  l: '/admin/links',
  a: '/admin/activity',
};

export default function useAdminShortcuts({ onOpenPalette, onOpenShortcuts }) {
  const navigate = useNavigate();
  const pendingGo = useRef(false);

  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      const tag = target?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;

      if (isTyping) return;

      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onOpenShortcuts?.();
        return;
      }

      if (e.key === 'g' || e.key === 'G') {
        if (!pendingGo.current) {
          pendingGo.current = true;
          window.setTimeout(() => { pendingGo.current = false; }, 1200);
        }
        return;
      }

      if (pendingGo.current) {
        const route = GO_ROUTES[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          pendingGo.current = false;
          navigate(route);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, onOpenPalette, onOpenShortcuts]);
}
