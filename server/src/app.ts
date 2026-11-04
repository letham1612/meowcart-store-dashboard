
import express from "express";

import {
  dashboardRouter,
} from "./modules/dashboard/dashboard.routes.js";

import {
  productsRouter,
} from "./modules/products/products.routes.js";

export const app = express();

// ==================== MIDDLEWARE ====================

app.disable("x-powered-by");

app.use(express.json());

// ==================== HEALTH CHECK ====================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

// ==================== ROUTES ====================

app.use("/api", dashboardRouter);

app.use("/api", productsRouter);

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});
