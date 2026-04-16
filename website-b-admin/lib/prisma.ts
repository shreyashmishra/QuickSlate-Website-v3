import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getServerEnv } from "@/lib/server-env";

declare global {
  var __quickSlatePrismaClient: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (!globalThis.__quickSlatePrismaClient) {
    const env = getServerEnv();
    const adapter = new PrismaPg({
      connectionString: env.DATABASE_URL,
    });

    globalThis.__quickSlatePrismaClient = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return globalThis.__quickSlatePrismaClient;
}
