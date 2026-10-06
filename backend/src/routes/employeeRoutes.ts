import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database";
import { createCrudRouter } from "./crudRouter";

const required = z.object({
  employeeCode: z.string().trim().min(1).max(32),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().email().max(254).transform((value) => value.toLowerCase()),
  department: z.string().trim().min(1).max(80),
  jobTitle: z.string().trim().min(1).max(100),
  status: z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE"]),
  hireDate: z.coerce.date(),
});
const updates = required.partial();
const crud = createCrudRouter({
  createSchema: required,
  updateSchema: updates,
  list: () => prisma.employee.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
  create: (data) => prisma.employee.create({ data }),
  update: (id, data) => prisma.employee.update({ where: { id }, data }),
  remove: (id) => prisma.employee.delete({ where: { id } }),
});
export const employeeRoutes = crud;
