import "server-only";

import { getPrismaClient } from "@/lib/prisma";
import type { AllowedUserRecord } from "@/types/auth";

export async function findAllowedUserByEmail(
  email: string,
): Promise<AllowedUserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const record = await getPrismaClient().allowedUser.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!record) {
    return null;
  }

  return {
    createdAt: record.createdAt,
    email: record.email,
    id: Number(record.id),
    isActive: record.isActive,
    role: record.role,
    updatedAt: record.updatedAt,
  };
}
