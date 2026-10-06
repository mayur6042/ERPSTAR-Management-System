import "../src/config/env";
import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function seed() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be configured with at least 12 characters.");
  }
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Workspace Admin",
      passwordHash: await hashPassword(password),
      role: UserRole.ADMIN,
    },
  });
  console.info(`Seeded administrator account: ${email}`);
}

seed()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
