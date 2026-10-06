import { z } from "zod";
import { prisma } from "../config/database";
import { createCrudRouter } from "./crudRouter";

const supplierSchema = z.object({
  name: z.string().trim().min(1).max(160),
  company: z.string().trim().max(160).default(""),
  email: z.union([z.string().email().max(254), z.literal("")]).default(""),
  phone: z.string().trim().max(40).default(""),
});

export const purchaseRoutes = createCrudRouter({
  createSchema: supplierSchema,
  updateSchema: supplierSchema.partial(),
  list: () => prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  create: (data) => prisma.supplier.create({ data }),
  update: (id, data) => prisma.supplier.update({ where: { id }, data }),
  remove: (id) => prisma.supplier.delete({ where: { id } }),
});
