
import { RefreshCw } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function Header({
  onRefresh,
  refreshing,
}: HeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#201747]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your store performance
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh dashboard"
          title="Refresh dashboard"
          className="rounded-xl border border-slate-200 bg-white p-3 text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
        >
          <RefreshCw
            size={19}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>
      </div>
    </header>
  );
}
