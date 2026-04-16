import type {
  PublicCarouselImage,
  PublicImageFeedResponse,
} from "@/types/public-images";

export type WebsiteACarouselItem = {
  caption: string | null;
  id: string;
  imageUrl: string;
  title: string | null;
  alt: string;
};

export async function fetchSharedCarouselImages(args: {
  baseUrl: string;
  limit?: number;
}): Promise<PublicCarouselImage[]> {
  const url = new URL("/api/public/images", args.baseUrl);

  if (args.limit) {
    url.searchParams.set("limit", String(args.limit));
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  });
  const payload = (await response.json()) as PublicImageFeedResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.ok ? "Unable to fetch carousel images." : payload.error.message,
    );
  }

  return payload.data.images;
}

export function mapPublicImagesToCarouselItems(
  images: PublicCarouselImage[],
): WebsiteACarouselItem[] {
  return images.map((image) => ({
    alt: image.alt_text ?? image.title ?? "Carousel image",
    caption: image.caption,
    id: image.id,
    imageUrl: image.public_url,
    title: image.title,
  }));
}
