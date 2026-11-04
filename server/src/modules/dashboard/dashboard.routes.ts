
import { Router } from "express";

import {
  getDashboardSummary,
  getShopInfo,
} from "./dashboard.service.js";

export const dashboardRouter = Router();

// GET /api/shop
dashboardRouter.get("/shop", async (_req, res) => {
  try {
    const shop = await getShopInfo();

    res.json(shop);
  } catch (error) {
    console.error("Shop error:", error);

    res.status(502).json({
      error: "Failed to fetch Shopify store",
    });
  }
});

// GET /api/dashboard
dashboardRouter.get(
  "/dashboard",
  async (_req, res) => {
    try {
      const data = await getDashboardSummary();

      res.json(data);
    } catch (error) {
      console.error("Dashboard error:", error);

      res.status(502).json({
        error: "Failed to fetch dashboard data",
      });
    }
  }
);
