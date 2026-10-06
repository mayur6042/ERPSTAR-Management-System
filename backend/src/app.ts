import "./config/env";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { authenticate } from "./middleware/authMiddleware";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { authRoutes } from "./routes/authRoutes";
import { chatRoutes } from "./routes/chatRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { employeeRoutes } from "./routes/employeeRoutes";
import { financeRoutes } from "./routes/financeRoutes";
import { inventoryRoutes } from "./routes/inventoryRoutes";
import { purchaseRoutes } from "./routes/purchaseRoutes";
import { salesRoutes } from "./routes/salesRoutes";

export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) ?? "http://localhost:5173",
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ data: { status: "ok" } }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }), authRoutes);
app.use("/api", authenticate);
app.use("/api/chat", rateLimit({ windowMs: 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }), chatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", inventoryRoutes);
app.use("/api", salesRoutes);
app.use("/api/suppliers", purchaseRoutes);
app.use("/api/expenses", financeRoutes);
app.use((_req, res) => res.status(404).json({ message: "The requested API route was not found." }));
app.use(errorMiddleware);
