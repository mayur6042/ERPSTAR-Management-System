import { z } from "zod";
import { prisma } from "../config/database";
import { createCrudRouter } from "./crudRouter";

const expenseSchema = z.object({
  description: z.string().trim().min(1).max(240),
  category: z.string().trim().min(1).max(80),
  amount: z.coerce.number().finite().positive().max(1000000000),
  date: z.coerce.date(),
  status: z.enum(["PENDING", "PAID"]),
});

export const financeRoutes = createCrudRouter({
  createSchema: expenseSchema,
  updateSchema: expenseSchema.partial(),
  list: () => prisma.expense.findMany({ orderBy: { date: "desc" } }),
  create: (data) => prisma.expense.create({ data }),
  update: (id, data) => prisma.expense.update({ where: { id }, data }),
  remove: (id) => prisma.expense.delete({ where: { id } }),
});
