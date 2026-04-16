import "server-only";

import type { Image, Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import type { AuthorizedPortalUser } from "@/types/auth";
import type { ImageListFilter } from "@/types/images";

function listWhereForUser(
  user: AuthorizedPortalUser,
  filter: ImageListFilter,
): Prisma.ImageWhereInput {
  if (user.role === "admin") {
    return filter === "deleted"
      ? { deletedAt: { not: null } }
      : { deletedAt: null };
  }

  return filter === "deleted"
    ? {
        deletedAt: { not: null },
        uploadedByUserId: BigInt(user.allowedUserId),
      }
    : { deletedAt: null };
}

function deletedCountWhereForUser(user: AuthorizedPortalUser): Prisma.ImageWhereInput {
  if (user.role === "admin") {
    return { deletedAt: { not: null } };
  }

  return {
    deletedAt: { not: null },
    uploadedByUserId: BigInt(user.allowedUserId),
  };
}

export async function listImagesForUser(
  user: AuthorizedPortalUser,
  filter: ImageListFilter,
) {
  const prisma = getPrismaClient();

  const [images, activeCount, deletedCount] = await prisma.$transaction([
    prisma.image.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      where: listWhereForUser(user, filter),
    }),
    prisma.image.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.image.count({
      where: deletedCountWhereForUser(user),
    }),
  ]);

  return {
    counts: {
      active: activeCount,
      deleted: deletedCount,
    },
    images,
  };
}

export async function listPublicCarouselImages(limit: number) {
  return getPrismaClient().image.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
    where: {
      deletedAt: null,
      isVisible: true,
    },
  });
}

export async function findImageById(id: string) {
  return getPrismaClient().image.findUnique({
    where: {
      id,
    },
  });
}

export async function createImageRecord(data: Prisma.ImageUncheckedCreateInput) {
  return getPrismaClient().image.create({ data });
}

export async function updateImageRecord(id: string, data: Prisma.ImageUncheckedUpdateInput) {
  return getPrismaClient().image.update({
    data,
    where: {
      id,
    },
  });
}

export async function deleteImageRecord(id: string) {
  return getPrismaClient().image.delete({
    where: {
      id,
    },
  });
}

export type PrismaImageRecord = Image;
