import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { HttpError } from "@/lib/api/http";
import { isAdmin, type AuthorizedPortalUser } from "@/lib/auth/session";
import {
  createImageRecord,
  deleteImageRecord,
  findImageById,
  listImagesForUser,
  updateImageRecord,
  type PrismaImageRecord,
} from "@/lib/images/repository";
import {
  getValidatedImageExtension,
  imageFilterSchema,
  imageIdSchema,
  parseImageUpdatePayload,
  parseUploadFormData,
} from "@/lib/images/validation";
import { getServerEnv } from "@/lib/server-env";
import {
  removeStorageObject,
  uploadStorageObject,
} from "@/lib/storage/supabase-storage";
import type {
  DashboardImage,
  ImageDeletePayload,
  ImageListPayload,
  ImageMutationPayload,
} from "@/types/images";

function isOwner(user: AuthorizedPortalUser, image: PrismaImageRecord) {
  return image.uploadedByUserId === BigInt(user.allowedUserId);
}

function toDashboardImage(
  image: PrismaImageRecord,
  currentUser: AuthorizedPortalUser,
): DashboardImage {
  const owner = isOwner(currentUser, image);
  const admin = isAdmin(currentUser);

  return {
    altText: image.altText,
    caption: image.caption,
    createdAt: image.createdAt.toISOString(),
    deletedAt: image.deletedAt?.toISOString() ?? null,
    displayOrder: image.displayOrder,
    id: image.id,
    isVisible: image.isVisible,
    permissions: {
      canEditMetadata: admin || owner,
      canEditVisibility: admin,
      canPermanentDelete: admin,
      canSoftDelete: admin || owner,
    },
    publicUrl: image.publicUrl,
    storagePath: image.storagePath,
    title: image.title,
    updatedAt: image.updatedAt.toISOString(),
    uploadedByEmail: image.uploadedByEmail,
    uploadedByUserId: Number(image.uploadedByUserId),
  };
}

function buildStorageKey(user: AuthorizedPortalUser, extension: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
  const userHash = createHash("sha256")
    .update(user.email)
    .digest("hex")
    .slice(0, 16);

  return `uploads/${year}/${month}/${userHash}/${randomUUID()}.${extension}`;
}

async function requireImageForMutation(id: string) {
  const image = await findImageById(imageIdSchema.parse(id));

  if (!image) {
    throw new HttpError(404, "image_not_found", "The requested image was not found.");
  }

  return image;
}

export async function getImageListPayload(
  user: AuthorizedPortalUser,
  filterInput: string | null | undefined,
): Promise<ImageListPayload> {
  const filter = imageFilterSchema.parse(filterInput ?? undefined);
  const { counts, images } = await listImagesForUser(user, filter);
  const env = getServerEnv();

  return {
    counts,
    currentUserRole: user.role,
    filter,
    images: images.map((image) => toDashboardImage(image, user)),
    maxUploadBytes: env.IMAGE_UPLOAD_MAX_BYTES,
    storageBucket: env.SUPABASE_STORAGE_BUCKET,
  };
}

export async function uploadImageForUser(
  user: AuthorizedPortalUser,
  formData: FormData,
): Promise<ImageMutationPayload> {
  const env = getServerEnv();
  const { file, metadata } = parseUploadFormData(formData);

  if (file.size > env.IMAGE_UPLOAD_MAX_BYTES) {
    throw new HttpError(
      400,
      "file_too_large",
      "Images must be 10 MB or smaller.",
      { fileSize: file.size, maxUploadBytes: env.IMAGE_UPLOAD_MAX_BYTES },
      { file: ["Images must be 10 MB or smaller."] },
    );
  }

  const extension = getValidatedImageExtension(file);
  const storagePath = buildStorageKey(user, extension);
  const fileBytes = Buffer.from(await file.arrayBuffer());

  const uploaded = await uploadStorageObject({
    contentType: file.type,
    fileBytes,
    storagePath,
  });

  try {
    const image = await createImageRecord({
      altText: metadata.altText,
      caption: metadata.caption,
      displayOrder: 0,
      isVisible: true,
      publicUrl: uploaded.publicUrl,
      storagePath: uploaded.storagePath,
      title: metadata.title,
      uploadedByEmail: user.email,
      uploadedByUserId: BigInt(user.allowedUserId),
    });

    return {
      image: toDashboardImage(image, user),
      message: "Image uploaded successfully.",
    };
  } catch (error) {
    await removeStorageObject(storagePath);
    throw error;
  }
}

export async function updateImageForUser(
  user: AuthorizedPortalUser,
  id: string,
  payload: unknown,
): Promise<ImageMutationPayload> {
  const image = await requireImageForMutation(id);
  const update = parseImageUpdatePayload(payload);
  const admin = isAdmin(user);
  const owner = isOwner(user, image);

  if (!admin && !owner) {
    throw new HttpError(
      403,
      "forbidden",
      "You can only edit metadata for images you uploaded.",
    );
  }

  if (!admin && ("displayOrder" in update || "isVisible" in update)) {
    throw new HttpError(
      403,
      "forbidden",
      "Only admins can update visibility and display order.",
    );
  }

  const updated = await updateImageRecord(image.id, {
    altText: update.altText,
    caption: update.caption,
    displayOrder: update.displayOrder,
    isVisible: update.isVisible,
    title: update.title,
  });

  return {
    image: toDashboardImage(updated, user),
    message: "Image metadata updated successfully.",
  };
}

export async function softDeleteImageForUser(
  user: AuthorizedPortalUser,
  id: string,
): Promise<ImageDeletePayload> {
  const image = await requireImageForMutation(id);
  const admin = isAdmin(user);
  const owner = isOwner(user, image);

  if (!admin && !owner) {
    throw new HttpError(
      403,
      "forbidden",
      "You can only soft delete images you uploaded.",
    );
  }

  await updateImageRecord(image.id, {
    deletedAt: image.deletedAt ?? new Date(),
    isVisible: false,
  });

  return {
    id: image.id,
    message: "Image soft deleted successfully.",
  };
}

export async function permanentlyDeleteImageForUser(
  user: AuthorizedPortalUser,
  id: string,
): Promise<ImageDeletePayload> {
  if (!isAdmin(user)) {
    throw new HttpError(
      403,
      "forbidden",
      "Only admins can permanently delete images.",
    );
  }

  const image = await requireImageForMutation(id);

  await removeStorageObject(image.storagePath);
  await deleteImageRecord(image.id);

  return {
    id: image.id,
    message: "Image permanently deleted.",
  };
}
