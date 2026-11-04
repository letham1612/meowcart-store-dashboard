
import { Activity } from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";

import type {
  ApiState,
  DashboardData,
} from "../../../types/dashboard.types";

import { formatChartDate } from "../../../utils/format";

interface OrdersChartProps {
  state: ApiState<DashboardData>;
  onRetry: () => void;
}

export function OrdersChart({
  state,
  onRetry,
}: OrdersChartProps) {
  const points = state.data?.ordersPerDay ?? [];

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
          <Activity size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Orders per Day
          </h2>

          <p className="text-sm text-slate-500">
            Last 14 Days
          </p>
        </div>
      </div>

      {state.loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : state.error ? (
        <ErrorState
          message={state.error}
          onRetry={onRetry}
        />
      ) : state.data?.ordersChartError ? (
        <ErrorState
          message="Unable to load orders chart."
          onRetry={onRetry}
        />
      ) : points.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          No chart data available.
        </div>
      ) : (
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{
                top: 10,
                right: 15,
                left: -25,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="ordersGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#7c3aed"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor="#7c3aed"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="date"
                tickFormatter={(value: string | number) =>
                  formatChartDate(String(value))
                }
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={16}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                labelFormatter={(value) =>
                  formatChartDate(String(value))
                }
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                }}
              />

              <Area
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#7c3aed"
                strokeWidth={3}
                fill="url(#ordersGradient)"
                dot={{
                  r: 3,
                  fill: "#ffffff",
                  stroke: "#7c3aed",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
