const STORE_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function formatChartDate(date: string): string {
  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}/${parts[1]}`;
}

export function formatDate(date: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: STORE_TIME_ZONE,
  }).format(parsed);
}

export function formatMoney(
  amount: number,
  currency: string | null
): string {
  if (!currency) {
    return amount.toLocaleString("en-US");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
