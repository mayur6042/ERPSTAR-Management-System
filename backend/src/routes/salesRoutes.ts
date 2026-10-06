import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database";
import { createCrudRouter } from "./crudRouter";

const customerSchema = z.object({
  name: z.string().trim().min(1).max(160),
  company: z.string().trim().max(160).default(""),
  email: z.union([z.string().email().max(254), z.literal("")]).default(""),
  phone: z.string().trim().max(40).default(""),
});
const orderSchema = z.object({
  orderNumber: z.string().trim().min(1).max(40),
  customerName: z.string().trim().min(1).max(160),
  total: z.coerce.number().finite().min(0).max(1000000000),
  status: z.enum(["DRAFT", "CONFIRMED", "PROCESSING", "SHIPPED", "CANCELLED"]),
  orderDate: z.coerce.date(),
});

export const salesRoutes = Router();
salesRoutes.use("/customers", createCrudRouter({
  createSchema: customerSchema,
  updateSchema: customerSchema.partial(),
  list: () => prisma.customer.findMany({ orderBy: { name: "asc" } }),
  create: (data) => prisma.customer.create({ data }),
  update: (id, data) => prisma.customer.update({ where: { id }, data }),
  remove: (id) => prisma.customer.delete({ where: { id } }),
}));
salesRoutes.use("/sales-orders", createCrudRouter({
  createSchema: orderSchema,
  updateSchema: orderSchema.partial(),
  list: () => prisma.salesOrder.findMany({ orderBy: { orderDate: "desc" } }),
  create: (data) => prisma.salesOrder.create({ data }),
  update: (id, data) => prisma.salesOrder.update({ where: { id }, data }),
  remove: (id) => prisma.salesOrder.delete({ where: { id } }),
}));
