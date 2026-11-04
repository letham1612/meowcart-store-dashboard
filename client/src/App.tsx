
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Package,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";

import { StatCard } from "./features/dashboard/components/StatCard";
import { OrdersChart } from "./features/dashboard/components/OrdersChart";

import { LowStockTable } from "./features/products/components/LowStockTable";

import { useDashboard } from "./features/dashboard/hooks/useDashboard";
import { useLowStock } from "./features/products/hooks/useLowStock";

import { formatMoney } from "./utils/format";

export default function App() {
  const dashboard = useDashboard();
  const lowStock = useLowStock();

  const stats = dashboard.data;

  function refreshAll() {
    void dashboard.refresh();
    void lowStock.refresh();
  }

  const cards = [
    {
      title: "Total Products",
      value: stats?.totalProducts ?? "—",
      icon: Package,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Active Products",
      value: stats?.activeProducts ?? "—",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Draft Products",
      value: stats?.draftProducts ?? "—",
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Orders (Last 30 Days)",
      value: stats?.ordersLast30Days ?? "—",
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    
    {
      title: "Revenue (Last 30 Days)",
      value:
        !stats
          ? "—"
          : stats.revenueLast30Days === null
            ? "N/A"
            : formatMoney(
                stats.revenueLast30Days,
                stats.currency
              ),
      icon: Wallet,
      color: "bg-rose-100 text-rose-600",
      titleBadge: stats?.currency ?? undefined,
      description:
        stats?.revenueError
          ? "Unable to access revenue data"
          : undefined,
    },

  ];

  return (
    <div className="min-h-screen bg-[#f7f7fd] text-slate-900 lg:flex">
      <Sidebar />

      <main
        id="dashboard"
        className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
      >
        <Header
          onRefresh={refreshAll}
          refreshing={
            dashboard.loading || lowStock.loading
          }
        />

        {/* DASHBOARD API ERROR */}

        {dashboard.error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} />

            <span>{dashboard.error}</span>

            <button
              type="button"
              onClick={() => void dashboard.refresh()}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* KPI CARDS */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {cards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              loading={dashboard.loading}
              description={card.description}
              titleBadge={card.titleBadge}
            />
          ))}
        </section>

        {/* ORDERS CHART */}

        <div className="mb-6">
          <OrdersChart
            state={dashboard}
            onRetry={() => void dashboard.refresh()}
          />
        </div>

        {/* LOW STOCK PRODUCTS */}

        <section id="products">
          <LowStockTable
            state={{
              data: lowStock.data,
              loading: lowStock.loading,
              error: lowStock.error,
            }}
            page={lowStock.page}
            pageSize={lowStock.pageSize}
            hasPrevious={lowStock.hasPrevious}
            onNext={lowStock.nextPage}
            onPrevious={lowStock.previousPage}
            onPageSizeChange={lowStock.changePageSize}
            onRetry={() => void lowStock.refresh()}
          />
        </section>

        {/* FOOTER */}

        <footer className="mt-6 flex flex-wrap justify-between gap-3 text-xs text-slate-400">
          <p>Meowcart Store Snapshot Dashboard</p>
          <p>Powered by Shopify Admin GraphQL API</p>
        </footer>
      </main>
    </div>
  );
}
