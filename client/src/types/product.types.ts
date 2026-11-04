
export interface Product {
  id: string;
  title: string;
  imageUrl: string | null;
  status: string;
  sku: string | null;
  totalInventory: number | null;
  tracksInventory: boolean;
  price: string | null;
  currency: string;
  vendor: string | null;
  updatedAt: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface LowStockData {
  products: Product[];
  pageInfo: PageInfo;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  countPrecision: string;
}
