import jwt, { type JwtPayload } from "jsonwebtoken";

export interface TokenUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return value;
}

export function createToken(user: TokenUser) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    secret(),
    { expiresIn: 8 * 60 * 60 },
  );
}

export function readToken(token: string): TokenUser {
  const decoded = jwt.verify(token, secret());
  if (typeof decoded === "string" || typeof decoded.sub !== "string") {
    throw new Error("Invalid authentication token.");
  }
  const payload = decoded as JwtPayload;
  return {
    id: decoded.sub,
    email: String(payload.email),
    name: String(payload.name),
    role: String(payload.role),
  };
}
