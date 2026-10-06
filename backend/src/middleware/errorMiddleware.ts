import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: "Please check the submitted information.", errors: error.flatten().fieldErrors });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({ message: "A record with one of these unique values already exists." });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    res.status(404).json({ message: "The requested record was not found." });
    return;
  }
  console.error("Unhandled request error:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
};
