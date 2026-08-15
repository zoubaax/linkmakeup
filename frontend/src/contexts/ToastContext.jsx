import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, options = {}) => {
    const id = ++toastId;
    const duration = options.duration ?? 3200;
    const type = options.type ?? 'default';

    setToasts((current) => [...current, { id, message, type }]);

    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }

    return id;
  }, [dismiss]);

  const value = useMemo(
    () => ({
      toast,
      success: (message, options) => toast(message, { ...options, type: 'success' }),
      error: (message, options) => toast(message, { ...options, type: 'error' }),
      dismiss,
      toasts,
    }),
    [toast, dismiss, toasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
