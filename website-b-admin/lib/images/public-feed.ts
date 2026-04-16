import "server-only";

import { z } from "zod";
import { listPublicCarouselImages } from "@/lib/images/repository";
import type { PrismaImageRecord } from "@/lib/images/repository";
import type {
  PublicCarouselImage,
  PublicImageFeedPayload,
} from "@/types/public-images";

const publicImageFeedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  order: z.enum(["carousel"]).default("carousel"),
});

function toPublicCarouselImage(image: PrismaImageRecord): PublicCarouselImage {
  return {
    alt_text: image.altText,
    caption: image.caption,
    created_at: image.createdAt.toISOString(),
    display_order: image.displayOrder,
    id: image.id,
    public_url: image.publicUrl,
    storage_path: image.storagePath,
    title: image.title,
  };
}

export function parsePublicImageFeedQuery(searchParams: URLSearchParams) {
  return publicImageFeedQuerySchema.parse({
    limit: searchParams.get("limit") ?? undefined,
    order: searchParams.get("order") ?? undefined,
  });
}

export async function getPublicImageFeedPayload(
  searchParams: URLSearchParams,
): Promise<PublicImageFeedPayload> {
  const query = parsePublicImageFeedQuery(searchParams);
  const images = await listPublicCarouselImages(query.limit);

  return {
    images: images.map((image) => toPublicCarouselImage(image)),
    meta: {
      count: images.length,
      generated_at: new Date().toISOString(),
      limit: query.limit,
      order: "display_order_asc_created_at_desc",
    },
  };
}
