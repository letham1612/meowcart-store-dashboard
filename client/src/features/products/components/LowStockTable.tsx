
import {
  Box,
  Package,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";

import { InventoryBadge } from "./InventoryBadge";
import { Pagination } from "./Pagination";

import type { ApiState } from "../../../types/dashboard.types";
import type { LowStockData } from "../../../types/product.types";

import { formatDate } from "../../../utils/format";

interface LowStockTableProps {
  state: ApiState<LowStockData>;
  page: number;
  pageSize: number;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onPageSizeChange: (value: number) => void;
  onRetry: () => void;
}

export function LowStockTable({
  state,
  page,
  pageSize,
  hasPrevious,
  onNext,
  onPrevious,
  onPageSizeChange,
  onRetry,
}: LowStockTableProps) {
  const products = state.data?.products ?? [];

  const headers = [
    "PRODUCT",
    "STATUS",
    "SKU",
    "INVENTORY",
    "PRICE",
    "VENDOR",
    "UPDATED AT",
  ];

  function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700";
      case "DRAFT":
        return "bg-amber-50 text-amber-700";
      case "ARCHIVED":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
            <Package size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Low-stock Products
            </h2>

            <p className="text-sm text-slate-500">
              Products with total inventory below 5
            </p>
          </div>
        </div>

        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          Inventory &lt; 5
        </span>
      </div>

      {state.loading ? (
        <div
          className="space-y-4 p-6"
          aria-label="Loading products"
        >
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className="h-14 w-full"
            />
          ))}
        </div>
      ) : state.error ? (
        <ErrorState
          message={state.error}
          onRetry={onRetry}
        />
      ) : products.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="rounded-full bg-violet-50 p-4 text-violet-400">
            <Box size={30} />
          </div>

          <h3 className="font-semibold text-slate-800">
            No low-stock products
          </h3>

          <p className="text-sm text-slate-500">
            No products found on this page.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto px-4 pb-4 sm:px-6">
          <table className="w-full min-w-225 border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                {headers.map((header, index) => (
                  <th
                    key={header}
                    className={`
                      px-4 py-4 font-semibold
                      ${index === 0 ? "rounded-l-lg" : ""}
                      ${index === headers.length - 1 ? "rounded-r-lg" : ""}
                      ${header === "INVENTORY" ? "text-center" : ""}
                    `}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 transition hover:bg-violet-50/40 last:border-0"
                >
                  {/* PRODUCT */}

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package
                            size={20}
                            className="text-slate-400"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {product.title}
                        </p>

                        {!product.tracksInventory && (
                          <p className="mt-1 text-xs text-amber-600">
                            Inventory not tracked
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-4">
                    <span
                      className={`
                        inline-flex rounded-full px-3 py-1
                        text-xs font-semibold
                        ${getStatusColor(product.status)}
                      `}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* SKU */}

                  <td className="px-4 py-4 text-slate-600">
                    {product.sku || "—"}
                  </td>

                  {/* INVENTORY */}

                  <td className="px-4 py-4 text-center">
                    <InventoryBadge
                      quantity={product.totalInventory}
                      tracksInventory={product.tracksInventory}
                    />
                  </td>

                  {/* PRICE */}

                  <td className="px-4 py-4 text-slate-700">
                    {product.price ?? "—"}
                  </td>

                  {/* VENDOR */}

                  <td className="px-4 py-4 text-slate-600">
                    {product.vendor ?? "—"}
                  </td>

                  {/* UPDATED AT */}

                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {product.updatedAt
                      ? formatDate(product.updatedAt)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}

      {!state.error && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={state.data?.totalCount ?? 0}
          totalPages={state.data?.totalPages ?? 0}
          currentCount={products.length}
          loading={state.loading}
          hasPrevious={hasPrevious}
          hasNext={
            state.data?.pageInfo.hasNextPage ?? false
          }
          onNext={onNext}
          onPrevious={onPrevious}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Card>
  );
}
