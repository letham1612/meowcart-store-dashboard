
export interface DailyOrders {
  date: string;
  orders: number;
}

export interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  ordersLast30Days: number;
  cancelledOrders: number;

  revenueLast30Days: number | null;
  currency: string | null;
  revenueError: string | null;

  ordersPerDay: DailyOrders[];
  ordersChartError: string | null;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
