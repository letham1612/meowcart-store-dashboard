
export const SHOP_QUERY = `
  query {
    shop {
      name
    }
  }
`;

export const PRODUCT_STATS_QUERY = `
  query {
    totalProducts: productsCount(
      limit: null
    ) {
      count
    }

    activeProducts: productsCount(
      query: "status:active"
      limit: null
    ) {
      count
    }

    draftProducts: productsCount(
      query: "status:draft"
      limit: null
    ) {
      count
    }
  }
`;

export const ORDER_COUNT_QUERY = `
  query ($filter: String!) {
    ordersCount(
      query: $filter
      limit: null
    ) {
      count
      precision
    }
  }
`;

export const ORDERS_QUERY = `
  query ($filter: String!, $cursor: String) {
    orders(
      first: 100
      after: $cursor
      query: $filter
      sortKey: CREATED_AT
      reverse: true
    ) {
      nodes {
        id
        createdAt

        currentTotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }

      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
