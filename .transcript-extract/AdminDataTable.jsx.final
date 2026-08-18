import { useEffect, useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { SkeletonCard } from '../ui/Skeleton';

export function useAdminList(fetcher, { status = 'all' } = {}) {
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

    fetcher({ page, limit: 20, search: debouncedSearch, status })
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
  }, [fetcher, page, debouncedSearch, status]);

  return {
    items,
    pagination,
    search: searchInput,
    setSearch: setSearchInput,
    page,
    setPage,
    loading,
    error,
  };
}

export function AdminTableShell({ children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {children}
    </div>
  );
}

export function AdminTableHead({ columns }) {
  return (
    <thead className="bg-surface-alt text-fg-muted">
      <tr>
        {columns.map((column) => (
          <th key={column} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function AdminDataTable({
  title,
  description,
  searchPlaceholder,
  search,
  onSearchChange,
  loading,
  error,
  isEmpty,
  emptyMessage,
  pagination,
  onPageChange,
  filters,
  children,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fg">{title}</h1>
          {description && <p className="text-sm text-fg-muted mt-1">{description}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {filters}
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-border bg-surface-alt text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <AdminTableShell>
          {isEmpty ? (
            <div className="px-5 py-12 text-center text-sm text-fg-muted">{emptyMessage}</div>
          ) : (
            <>
              <div className="overflow-x-auto">{children}</div>
              {pagination && pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-3">
                  <p className="text-xs text-fg-muted">
                    Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!pagination.hasPrev}
                      onClick={() => onPageChange(pagination.page - 1)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!pagination.hasNext}
                      onClick={() => onPageChange(pagination.page + 1)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </AdminTableShell>
      )}
    </div>
  );
}
