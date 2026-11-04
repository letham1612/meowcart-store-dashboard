
import "dotenv/config";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value.trim();
}

function getPort(): number {
  const port = Number(process.env.PORT ?? 3000);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error("Invalid PORT");
  }

  return port;
}

function getStoreDomain(): string {
  const domain = requiredEnv(
    "SHOPIFY_STORE_DOMAIN"
  );

  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(
      domain
    )
  ) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN must be a valid myshopify.com hostname"
    );
  }

  return domain;
}

export const env = {
  PORT: getPort(),

  SHOPIFY_STORE_DOMAIN: getStoreDomain(),

  SHOPIFY_ACCESS_TOKEN: requiredEnv(
    "SHOPIFY_ACCESS_TOKEN"
  ),

  SHOPIFY_API_VERSION:
    process.env.SHOPIFY_API_VERSION ?? "2026-10",
};
