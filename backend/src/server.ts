import { app } from "./app";
import { prisma } from "./config/database";

const port = Number(process.env.PORT ?? 4000);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}

async function start() {
  await prisma.$connect();
  const server = app.listen(port, () => {
    console.info(`ERP API listening on port ${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch(async (error: unknown) => {
  console.error("Failed to start ERP API:", error);
  await prisma.$disconnect();
  process.exitCode = 1;
});
