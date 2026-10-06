import type { NextFunction, Request, Response } from "express";
import { readToken, type TokenUser } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication is required." });
    return;
  }
  try {
    req.user = readToken(authorization.slice(7));
    next();
  } catch {
    res.status(401).json({ message: "Your session is invalid or has expired." });
  }
}
