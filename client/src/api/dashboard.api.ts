
import { apiClient } from "./client";

import type {
  DashboardData,
} from "../types/dashboard.types";

import type {
  LowStockData,
} from "../types/product.types";

export const dashboardApi = {
  getSummary(signal?: AbortSignal) {
    return apiClient<DashboardData>(
      "/api/dashboard",
      signal
    );
  },

  getLowStock(
    cursor: string | null,
    first: number,
    signal?: AbortSignal
  ) {
    const params = new URLSearchParams({
      first: String(first),
    });

    if (cursor !== null) {
      params.set("cursor", cursor);
    }

    return apiClient<LowStockData>(
      `/api/low-stock?${params.toString()}`,
      signal
    );
  },
};
