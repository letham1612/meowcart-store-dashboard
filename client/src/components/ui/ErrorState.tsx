
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-full bg-red-50 p-3 text-red-500">
        <AlertCircle size={27} />
      </div>

      <h3 className="font-semibold text-slate-800">
        Failed to load data
      </h3>

      <p className="max-w-sm text-sm text-slate-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );
}
