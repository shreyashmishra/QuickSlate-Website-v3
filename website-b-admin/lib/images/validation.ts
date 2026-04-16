import { z } from "zod";
import { HttpError } from "@/lib/api/http";

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value.length > 0 ? value : null));

export const imageFilterSchema = z.enum(["active", "deleted"]).default("active");

export const imageIdSchema = z.uuid();

export const imageUpdateSchema = z
  .object({
    altText: optionalText(180).optional(),
    caption: optionalText(500).optional(),
    displayOrder: z.number().int().min(0).max(100000).optional(),
    isVisible: z.boolean().optional(),
    title: optionalText(120).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be updated.",
  });

export function parseImageUpdatePayload(payload: unknown) {
  return imageUpdateSchema.parse(payload);
}

const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export function parseUploadFormData(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new HttpError(
      400,
      "missing_file",
      "A file is required for upload.",
      undefined,
      { file: ["A file is required."] },
    );
  }

  const parsed = z
    .object({
      altText: optionalText(180),
      caption: optionalText(500),
      title: optionalText(120),
    })
    .parse({
      altText: formData.get("altText") ?? "",
      caption: formData.get("caption") ?? "",
      title: formData.get("title") ?? "",
    });

  return {
    file,
    metadata: parsed,
  };
}

export function getValidatedImageExtension(file: File) {
  const extensionFromName = file.name.split(".").pop()?.trim().toLowerCase() ?? "";
  const normalizedByMimeType = allowedMimeTypes.get(file.type);

  if (!normalizedByMimeType || !allowedExtensions.has(extensionFromName)) {
    throw new HttpError(
      400,
      "unsupported_file_type",
      "Only jpg, jpeg, png, and webp images are allowed.",
      { mimeType: file.type },
      { file: ["Only jpg, jpeg, png, and webp files are allowed."] },
    );
  }

  return normalizedByMimeType;
}
