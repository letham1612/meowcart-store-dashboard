const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const STORE_TIME_ZONE = "Asia/Ho_Chi_Minh";

const storeDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: STORE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export type StoreDayRange = {
  date: string;
  from: Date;
  to: Date;
};

function parseDateKey(date: string): {
  year: number;
  month: number;
  day: number;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    throw new Error(`Invalid calendar date: ${date}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date: ${date}`);
  }

  return { year, month, day };
}

export function getStoreDate(instant: Date): string {
  if (Number.isNaN(instant.getTime())) {
    throw new Error("Invalid date instant");
  }

  const values = new Map(
    storeDateFormatter
      .formatToParts(instant)
      .map((part) => [part.type, part.value])
  );

  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

export function addCalendarDays(date: string, days: number): string {
  if (!Number.isInteger(days)) {
    throw new Error("Calendar day offset must be an integer");
  }

  const { year, month, day } = parseDateKey(date);
  const result = new Date(Date.UTC(year, month - 1, day + days));

  return result.toISOString().slice(0, 10);
}

// Find the first UTC instant belonging to a Vietnam calendar date. Keeping
// this conversion here prevents the Shopify UTC timestamps from being
// mutated or interpreted in the server's host timezone.
export function startOfStoreDay(date: string): Date {
  const { year, month, day } = parseDateKey(date);
  const utcMidnight = Date.UTC(year, month - 1, day);
  let low = utcMidnight - 24 * 60 * 60 * 1000;
  let high = utcMidnight + 24 * 60 * 60 * 1000;

  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);

    if (getStoreDate(new Date(middle)) < date) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  const result = new Date(low);

  if (getStoreDate(result) !== date) {
    throw new Error(`Invalid store calendar date: ${date}`);
  }

  return result;
}

export function buildStoreDayRanges(
  now: Date,
  numberOfDays: number
): StoreDayRange[] {
  if (!Number.isInteger(numberOfDays) || numberOfDays < 1) {
    throw new Error("Number of days must be a positive integer");
  }

  const currentDate = getStoreDate(now);
  const firstDate = addCalendarDays(
    currentDate,
    -(numberOfDays - 1)
  );
  const boundaries = new Map<string, Date>();

  function getBoundary(date: string): Date {
    const cached = boundaries.get(date);

    if (cached) return cached;

    const boundary = startOfStoreDay(date);
    boundaries.set(date, boundary);
    return boundary;
  }

  return Array.from({ length: numberOfDays }, (_, index) => {
    const date = addCalendarDays(firstDate, index);
    const nextDate = addCalendarDays(date, 1);
    const nextBoundary = getBoundary(nextDate);

    return {
      date,
      from: getBoundary(date),
      to:
        date === currentDate && now < nextBoundary
          ? now
          : nextBoundary,
    };
  });
}

// Orders and revenue use an elapsed-time window, not store calendar days.
export function buildRollingDaysFilter(
  now: Date,
  numberOfDays: number
): string {
  const from = new Date(
    now.getTime() - numberOfDays * MILLISECONDS_PER_DAY
  );

  return (
    `created_at:>='${from.toISOString()}' ` +
    `created_at:<='${now.toISOString()}'`
  );
}
