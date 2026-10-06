import { Router } from "express";
import { prisma } from "../config/database";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", async (_req, res, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [employeeCount, products, customerCount, openOrders, expenses, recentOrders] = await Promise.all([
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.product.findMany({ select: { unitPrice: true, quantity: true } }),
      prisma.customer.count(),
      prisma.salesOrder.count({ where: { status: { in: ["DRAFT", "CONFIRMED", "PROCESSING"] } } }),
      prisma.expense.findMany({ where: { date: { gte: monthStart, lt: nextMonthStart } }, select: { amount: true } }),
      prisma.salesOrder.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    const inventoryValue = products.reduce((total, product) => total + Number(product.unitPrice) * product.quantity, 0);
    const monthlyExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);
    res.json({ data: {
      employeeCount,
      productCount: products.length,
      inventoryValue,
      customerCount,
      openOrders,
      monthlyExpenses,
      recentOrders,
    } });
  } catch (error) {
    next(error);
  }
});
