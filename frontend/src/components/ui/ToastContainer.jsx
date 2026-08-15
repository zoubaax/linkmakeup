import { useToast } from '../../contexts/ToastContext';

const TYPE_STYLES = {
  default: 'border-border bg-surface text-fg',
  success: 'border-accent-border bg-accent-subtle text-fg',
  error: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
};

const TYPE_ICONS = {
  default: null,
  success: (
    <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-toast-in ${TYPE_STYLES[item.type] ?? TYPE_STYLES.default}`}
        >
          {TYPE_ICONS[item.type]}
          <p className="text-sm font-medium flex-1">{item.message}</p>
          <button
            type="button"
            onClick={() => dismiss(item.id)}
            className="text-fg-subtle hover:text-fg transition-colors shrink-0"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
