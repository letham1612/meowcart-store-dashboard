import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRollingDaysFilter,
  buildStoreDayRanges,
  getStoreDate,
} from "./date.js";

test("builds exact UTC boundaries for Vietnam calendar days", () => {
  const ranges = buildStoreDayRanges(
    new Date("2026-11-04T12:00:00.000Z"),
    3
  );

  assert.deepEqual(
    ranges.map(({ date, from, to }) => ({
      date,
      from: from.toISOString(),
      to: to.toISOString(),
    })),
    [
      {
        date: "2026-11-02",
        from: "2026-11-01T17:00:00.000Z",
        to: "2026-11-02T17:00:00.000Z",
      },
      {
        date: "2026-11-03",
        from: "2026-11-02T17:00:00.000Z",
        to: "2026-11-03T17:00:00.000Z",
      },
      {
        date: "2026-11-04",
        from: "2026-11-03T17:00:00.000Z",
        to: "2026-11-04T12:00:00.000Z",
      },
    ]
  );
});

test("maps Shopify UTC timestamps around midnight to Vietnam dates", () => {
  assert.equal(
    getStoreDate(new Date("2026-11-02T16:59:59.999Z")),
    "2026-11-02"
  );
  assert.equal(
    getStoreDate(new Date("2026-11-02T17:00:00.000Z")),
    "2026-11-03"
  );
});

test("keeps the 30-day filter as a rolling 30 x 24-hour window", () => {
  const now = new Date("2026-11-04T12:34:56.789Z");

  assert.equal(
    buildRollingDaysFilter(now, 30),
    "created_at:>='2026-10-05T12:34:56.789Z' " +
      "created_at:<='2026-11-04T12:34:56.789Z'"
  );
});
