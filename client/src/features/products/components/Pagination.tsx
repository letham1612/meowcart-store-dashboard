
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  currentCount: number;
  loading: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onPageSizeChange: (value: number) => void;
}

export function Pagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  currentCount,
  loading,
  hasPrevious,
  hasNext,
  onNext,
  onPrevious,
  onPageSizeChange,
}: PaginationProps) {
  const start =
    totalCount === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const end =
    totalCount === 0
      ? 0
      : Math.min(
          (page - 1) * pageSize + currentCount,
          totalCount
        );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:px-6">
      <p className="text-sm text-slate-500">
        Showing {start}–{end} of {totalCount} products
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="rows-per-page"
          className="text-sm text-slate-500"
        >
          Rows per page
        </label>

        <select
          id="rows-per-page"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 disabled:opacity-50"
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <span className="min-w-14 text-center text-sm font-medium text-slate-700">
          {page} / {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          onClick={onPrevious}
          disabled={loading || !hasPrevious}
          aria-label="Previous page"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={19} />
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={loading || !hasNext}
          aria-label="Next page"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={19} />
        </button>
      </div>
    </div>
  );
}
