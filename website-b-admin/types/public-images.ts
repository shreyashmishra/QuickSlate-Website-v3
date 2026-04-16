import type { ApiResponse } from "@/lib/api/http";

export type PublicCarouselImage = {
  alt_text: string | null;
  caption: string | null;
  created_at: string;
  display_order: number;
  id: string;
  public_url: string;
  storage_path: string;
  title: string | null;
};

export type PublicImageFeedOrder = "display_order_asc_created_at_desc";

export type PublicImageFeedPayload = {
  images: PublicCarouselImage[];
  meta: {
    count: number;
    generated_at: string;
    limit: number;
    order: PublicImageFeedOrder;
  };
};

export type PublicImageFeedResponse = ApiResponse<PublicImageFeedPayload>;
