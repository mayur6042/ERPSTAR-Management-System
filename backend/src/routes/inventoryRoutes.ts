import { z } from "zod";
import { prisma } from "../config/database";
import { createCrudRouter } from "./crudRouter";

const productSchema = z.object({
  sku: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(100),
  unitPrice: z.coerce.number().finite().min(0).max(100000000),
  quantity: z.coerce.number().int().min(0).max(100000000),
  reorderLevel: z.coerce.number().int().min(0).max(100000000),
});

export const inventoryRoutes = createCrudRouter({
  createSchema: productSchema,
  updateSchema: productSchema.partial(),
  list: () => prisma.product.findMany({ orderBy: { name: "asc" } }),
  create: (data) => prisma.product.create({ data }),
  update: (id, data) => prisma.product.update({ where: { id }, data }),
  remove: (id) => prisma.product.delete({ where: { id } }),
});
