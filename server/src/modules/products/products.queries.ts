
export const LOW_STOCK_QUERY = `
  query ($cursor: String, $first: Int!) {
    products(
      first: $first
      after: $cursor
      query: "inventory_total:<5"
    ) {
      nodes {
        id
        title
        status
        vendor
        totalInventory
        tracksInventory
        updatedAt

        featuredImage {
          url
          altText
        }

        variants(first: 1) {
          nodes {
            id
            sku
            price
          }
        }
      }

      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }

    lowStockCount: productsCount(
      query: "inventory_total:<5"
      limit: null
    ) {
      count
      precision
    }

    shop {
      currencyCode
    }
  }
`;
