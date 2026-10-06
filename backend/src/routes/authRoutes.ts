import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/authMiddleware";
import { verifyPassword } from "../utils/password";
import { createToken } from "../utils/jwt";

export const authRoutes = Router();

authRoutes.post("/login", async (req, res, next) => {
  try {
    const input = z.object({
      email: z.string().email().max(254),
      password: z.string().min(1).max(200),
    }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      res.status(401).json({ message: "Email or password is incorrect." });
      return;
    }
    const publicUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    res.json({ data: { token: createToken(publicUser), user: publicUser } });
  } catch (error) {
    next(error);
  }
});

authRoutes.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      res.status(401).json({ message: "This account is no longer available." });
      return;
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});
