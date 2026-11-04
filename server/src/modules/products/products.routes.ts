
import { Router } from "express";

import {
  getLowStockProducts,
} from "./products.service.js";

export const productsRouter = Router();

// GET /api/low-stock?first=5&cursor=...
productsRouter.get(
  "/low-stock",
  async (req, res) => {
    try {
      const rawFirst = req.query.first;

      const first =
        rawFirst === undefined
          ? 10
          : typeof rawFirst === "string"
            ? Number(rawFirst)
            : NaN;

      if (
        !Number.isInteger(first) ||
        first < 1 ||
        first > 100
      ) {
        res.status(400).json({
          error:
            "first must be an integer between 1 and 100",
        });

        return;
      }

      const rawCursor = req.query.cursor;

      if (
        rawCursor !== undefined &&
        typeof rawCursor !== "string"
      ) {
        res.status(400).json({
          error: "cursor must be a string",
        });

        return;
      }

      const cursor = rawCursor ?? null;

      const data = await getLowStockProducts(
        cursor,
        first
      );

      res.json(data);
    } catch (error) {
      console.error(
        "Low-stock error:",
        error
      );

      res.status(502).json({
        error:
          "Failed to fetch low-stock products",
      });
    }
  }
);
