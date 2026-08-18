import { useEffect, useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { SkeletonCard } from '../ui/Skeleton';

export function useAdminList(fetcher, { status = 'all', limit = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetcher({ page, limit, search: debouncedSearch, status })
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setItems(res.data.items || []);
          setPagination(res.data.pagination || null);
        } else {
          setError(res.message || 'Failed to load data');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, page, limit, debouncedSearch, status]);

  const isSearching = searchInput !== debouncedSearch || loading;

  return {
    items,
    pagination,
    search: searchInput,
    setSearch: setSearchInput,
    isSearching,
    page,
    setPage,
    loading,
    error,
  };
}

export function AdminFilterPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
            value === option.value
              ? 'border-accent-border bg-accent-subtle text-fg'
              : 'border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-alt',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function AdminDataTable({
  title,
  description,
  searchPlaceholder,
  search,
  onSearchChange,
  isSearching = false,
  filters,
  loading,
  error,
  isEmpty,
  emptyMessage,
  pagination,
  onPageChange,
  children,
  showSearch = true,
  actions,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-fg">{title}</h2>
          {description && <p className="text-sm text-fg-muted mt-1">{description}</p>}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {actions && <div className="shrink-0">{actions}</div>}
          {showSearch && (
            <div className="relative w-full lg:max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-border bg-surface-alt/70 pl-10 pr-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {isSearching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-fg-subtle">
                  Searching…
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {filters && <div>{filters}</div>}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : isEmpty ? (
          <div className="px-5 py-12 text-center text-sm text-fg-muted">{emptyMessage}</div>
        ) : (
          children
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-fg-muted">
            Page {pagination.page} of {pagination.totalPages}
            <span className="text-fg-subtle"> · {pagination.total} total</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              className="rounded-lg border border-border px-3 py-1.5 font-medium text-fg-muted hover:text-fg hover:bg-nav-hover disabled:opacity-40 disabled:pointer-events-none"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              className="rounded-lg border border-border px-3 py-1.5 font-medium text-fg-muted hover:text-fg hover:bg-nav-hover disabled:opacity-40 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminTableShell({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function AdminTableHead({ columns }) {
  return (
    <thead className="bg-surface-alt text-fg-muted">
      <tr>
        {columns.map((column) => (
          <th key={column} className="px-5 py-3 text-left font-semibold whitespace-nowrap">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
