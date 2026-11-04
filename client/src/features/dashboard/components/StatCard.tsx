
import type { ComponentType } from "react";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ size?: number }>;
  color: string;
  loading: boolean;
  description?: string;
  titleBadge?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
  description,
  titleBadge,
}: StatCardProps) {
  return (
    <Card className="min-w-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            {titleBadge && (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500">
                {titleBadge}
              </span>
            )}
          </div>

          {loading ? (
            <Skeleton className="mt-4 h-9 w-20" />
          ) : (
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
          )}
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={23} />
        </div>
      </div>

      {!loading && description && (
        <p className="mt-3 text-xs text-rose-600">
          {description}
        </p>
      )}
    </Card>
  );
}
