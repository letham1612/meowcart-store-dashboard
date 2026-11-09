
import {
  shopifyGraphQL,
  ShopifyGraphQLError,
} from "../../lib/shopify.js";

import {
  SHOP_QUERY,
  PRODUCT_STATS_QUERY,
  ORDER_COUNT_QUERY,
  ORDERS_QUERY,
} from "./dashboard.queries.js";

import {
  buildRollingDaysFilter,
  buildStoreDayRanges,
} from "../../utils/date.js";

// ==================== TYPES ====================

type CountResult = {
  count: number;
  precision?: string;
};

type ShopResponse = {
  shop: {
    name: string;
  };
};

type ProductStatsResponse = {
  totalProducts: CountResult;
  activeProducts: CountResult;
  draftProducts: CountResult;
};

type OrderCountResponse = {
  ordersCount: CountResult;
};

type Order = {
  id: string;
  createdAt: string;

  currentTotalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
};

type OrdersResponse = {
  orders: {
    nodes: Order[];

    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

type DailyOrders = {
  date: string;
  orders: number;
};

type RevenueResult = {
  revenue: number | null;
  currency: string | null;
  error: string | null;
};

// ==================== SHOP ====================

export async function getShopInfo() {
  const data = await shopifyGraphQL<ShopResponse>(
    SHOP_QUERY
  );

  return data.shop;
}

// ==================== ORDERS ====================

async function getAllOrders(
  filter: string
): Promise<Order[]> {
  const allOrders: Order[] = [];

  let cursor: string | null = null;

  while (true) {
    const data: OrdersResponse =
      await shopifyGraphQL<OrdersResponse>(
        ORDERS_QUERY,
        {
          filter,
          cursor,
        }
      );

    allOrders.push(...data.orders.nodes);

    const pageInfo = data.orders.pageInfo;

    if (!pageInfo.hasNextPage) {
      break;
    }

    if (
      !pageInfo.endCursor ||
      pageInfo.endCursor === cursor
    ) {
      throw new Error(
        "Invalid Shopify order pagination cursor"
      );
    }

    cursor = pageInfo.endCursor;
  }

  return allOrders;
}

// ==================== REVENUE ====================

async function getRevenue(
  filter: string,
  orderCount: number
): Promise<RevenueResult> {
  if (orderCount === 0) {
    return {
      revenue: 0,
      currency: null,
      error: null,
    };
  }

  try {
    const orders = await getAllOrders(filter);

    let revenue = 0;
    let currency: string | null = null;

    for (const order of orders) {
      const money =
        order.currentTotalPriceSet.shopMoney;

      const amount = Number(money.amount);

      if (!Number.isFinite(amount)) {
        throw new Error(
          "Invalid Shopify order amount"
        );
      }

      if (
        currency !== null &&
        currency !== money.currencyCode
      ) {
        throw new Error(
          "Orders have different currencies"
        );
      }

      revenue += amount;
      currency = money.currencyCode;
    }

    return {
      revenue: Math.round(revenue * 100) / 100,
      currency,
      error: null,
    };
  } catch (error: unknown) {
    console.error("Revenue query failed:", error);

    const isAccessDenied =
      error instanceof ShopifyGraphQLError &&
      (
        error.code === "ACCESS_DENIED" ||
        error.message.includes(
          "not approved to access"
        )
      );

    return {
      revenue: null,
      currency: null,
      error: isAccessDenied
        ? "ORDER_ACCESS_DENIED"
        : "REVENUE_UNAVAILABLE",
    };
  }
}

// ==================== ORDERS CHART ====================

// Returns the last 14 Vietnam calendar days, including the current day.
async function getOrdersPerDay(
  now: Date
): Promise<DailyOrders[]> {
  const queryParts: string[] = [];
  const ranges = buildStoreDayRanges(now, 14);

  ranges.forEach(({ from, to }, index) => {
    const filter =
      `created_at:>='${from.toISOString()}' ` +
      `created_at:<'${to.toISOString()}'`;

    const alias = `day${index + 1}`;

    queryParts.push(`
      ${alias}: ordersCount(
        query: ${JSON.stringify(filter)}
        limit: null
      ) {
        count
        precision
      }
    `);
  });

  const query = `
    query {
      ${queryParts.join("\n")}
    }
  `;

  const data = await shopifyGraphQL<
    Record<string, CountResult>
  >(query);

  return ranges.map(({ date }, index) => {
    const alias = `day${index + 1}`;

    return {
      date,
      orders: data[alias].count,
    };
  });
}

// ==================== SUMMARY ====================

export async function getDashboardSummary() {
  const now = new Date();

  const filter = buildRollingDaysFilter(now, 30);

  // Independent dashboard requests.
  const [
    productStats,
    orderStats,
    cancelledOrderStats,
    chartResult,
  ] = await Promise.all([
    shopifyGraphQL<ProductStatsResponse>(
      PRODUCT_STATS_QUERY
    ),

    shopifyGraphQL<OrderCountResponse>(
      ORDER_COUNT_QUERY,
      { filter }
    ),

    shopifyGraphQL<OrderCountResponse>(
      ORDER_COUNT_QUERY,
      { filter: "status:cancelled" }
    ),

    getOrdersPerDay(now)
      .then((data) => ({
        data,
        error: null as string | null,
      }))
      .catch((error: unknown) => {
        console.error(
          "Orders chart query failed:",
          error
        );

        return {
          data: [] as DailyOrders[],
          error: "ORDERS_CHART_UNAVAILABLE",
        };
      }),
  ]);

  // Revenue failure must not break other KPIs.
  const revenueResult = await getRevenue(
    filter,
    orderStats.ordersCount.count
  );

  return {
    totalProducts:
      productStats.totalProducts.count,

    activeProducts:
      productStats.activeProducts.count,

    draftProducts:
      productStats.draftProducts.count,

    ordersLast30Days:
      orderStats.ordersCount.count,

    cancelledOrders:
      cancelledOrderStats.ordersCount.count,

    revenueLast30Days:
      revenueResult.revenue,

    currency:
      revenueResult.currency,

    revenueError:
      revenueResult.error,

    ordersPerDay:
      chartResult.data,

    ordersChartError:
      chartResult.error,
  };
}
