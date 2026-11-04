
import { env } from "../config/env.js";

type GraphQLError = {
  message: string;
  extensions?: {
    code?: string;
  };
};

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: GraphQLError[];
};

export class ShopifyGraphQLError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ShopifyGraphQLError";
  }
}

export async function shopifyGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const url =
    `https://${env.SHOPIFY_STORE_DOMAIN}` +
    `/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token":
        env.SHOPIFY_ACCESS_TOKEN,
    },

    body: JSON.stringify({
      query,
      variables,
    }),

    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify HTTP error: ${response.status} ${response.statusText}`
    );
  }

  const result =
    (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    const firstError = result.errors[0];

    throw new ShopifyGraphQLError(
      result.errors
        .map((error) => error.message)
        .join("; "),
      firstError.extensions?.code
    );
  }

  if (result.data == null) {
    throw new Error(
      "Shopify GraphQL returned no data"
    );
  }

  return result.data;
}
