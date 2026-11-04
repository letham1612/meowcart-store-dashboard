
import { shopifyGraphQL } from "../../lib/shopify.js";

import {
  LOW_STOCK_QUERY,
} from "./products.queries.js";

// ==================== TYPES ====================

type ProductVariant = {
  id: string;
  sku: string | null;
  price: string;
};

type ShopifyProduct = {
  id: string;
  title: string;
  status: string;
  vendor: string;
  totalInventory: number;
  tracksInventory: boolean;
  updatedAt: string;

  featuredImage: {
    url: string;
    altText: string | null;
  } | null;

  variants: {
    nodes: ProductVariant[];
  };
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

type LowStockResponse = {
  products: {
    nodes: ShopifyProduct[];
    pageInfo: PageInfo;
  };

  lowStockCount: {
    count: number;
    precision: string;
  };

  shop: {
    currencyCode: string;
  };
};

// ==================== HELPERS ====================

function formatPrice(
  price: string | undefined,
  currency: string
): string | null {
  if (price === undefined) {
    return null;
  }

  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// ==================== SERVICE ====================

export async function getLowStockProducts(
  cursor: string | null = null,
  first: number = 10
) {
  if (
    !Number.isInteger(first) ||
    first < 1 ||
    first > 100
  ) {
    throw new Error(
      "Page size must be between 1 and 100"
    );
  }

  const data = await shopifyGraphQL<LowStockResponse>(
    LOW_STOCK_QUERY,
    {
      cursor,
      first,
    }
  );

  const currency = data.shop.currencyCode;

  const products = data.products.nodes.map(
    (product) => {
      const variant = product.variants.nodes[0];

      return {
        id: product.id,
        title: product.title,

        imageUrl:
          product.featuredImage?.url ?? null,

        status: product.status,

        sku: variant?.sku || null,

        totalInventory:
          product.totalInventory,

        tracksInventory:
          product.tracksInventory,

        price: formatPrice(
          variant?.price,
          currency
        ),

        currency,

        vendor:
          product.vendor || null,

        updatedAt:
          product.updatedAt,
      };
    }
  );

  const totalCount =
    data.lowStockCount.count;

  const totalPages = Math.ceil(
    totalCount / first
  );

  return {
    products,

    pageInfo: data.products.pageInfo,

    totalCount,

    totalPages,

    pageSize: first,

    countPrecision:
      data.lowStockCount.precision,
  };
}
