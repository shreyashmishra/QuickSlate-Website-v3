import type { ProjectCarouselItem } from "@/app/components/ProjectCarousel";

type PublicCarouselImage = {
  alt_text: string | null;
  caption: string | null;
  created_at: string;
  display_order: number;
  id: string;
  public_url: string;
  storage_path: string;
  title: string | null;
};

type PublicImageFeedSuccess = {
  ok: true;
  data: {
    images: PublicCarouselImage[];
  };
};

type PublicImageFeedFailure = {
  ok: false;
  error: {
    message: string;
  };
};

type PublicImageFeedResponse = PublicImageFeedSuccess | PublicImageFeedFailure;

type CarouselFeedResult = {
  errorMessage: string | null;
  items: ProjectCarouselItem[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPublicCarouselImage(value: unknown): value is PublicCarouselImage {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.public_url === "string" &&
    typeof value.storage_path === "string" &&
    typeof value.display_order === "number" &&
    typeof value.created_at === "string" &&
    (typeof value.title === "string" || value.title === null) &&
    (typeof value.caption === "string" || value.caption === null) &&
    (typeof value.alt_text === "string" || value.alt_text === null)
  );
}

function parsePublicImageFeed(payload: unknown): PublicImageFeedResponse {
  if (!isRecord(payload) || typeof payload.ok !== "boolean") {
    throw new Error("Invalid Website B feed response.");
  }

  if (!payload.ok) {
    const error = isRecord(payload.error) ? payload.error : {};
    const message =
      typeof error.message === "string"
        ? error.message
        : "Website B returned an invalid error payload.";

    return {
      error: { message },
      ok: false,
    };
  }

  const data = isRecord(payload.data) ? payload.data : {};
  const rawImages = Array.isArray(data.images) ? data.images : null;

  if (!rawImages || !rawImages.every(isPublicCarouselImage)) {
    throw new Error("Website B returned an invalid image feed payload.");
  }

  return {
    data: {
      images: rawImages,
    },
    ok: true,
  };
}

function toProjectCarouselItem(image: PublicCarouselImage): ProjectCarouselItem {
  return {
    category: undefined,
    description: image.caption ?? undefined,
    id: image.id,
    image: image.public_url,
    title: image.title ?? "QuickSlate image",
  };
}

export async function fetchWebsiteBCarouselItems(): Promise<CarouselFeedResult> {
  const feedUrl = process.env.WEBSITE_B_PUBLIC_FEED_URL;

  if (!feedUrl) {
    return {
      errorMessage:
        "The shared carousel feed is not configured. Add WEBSITE_B_PUBLIC_FEED_URL to QuickSlate.",
      items: [],
    };
  }

  try {
    const response = await fetch(feedUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    const payload = parsePublicImageFeed(await response.json());

    if (!response.ok || !payload.ok) {
      return {
        errorMessage: payload.ok
          ? "The shared carousel feed is unavailable."
          : payload.error.message,
        items: [],
      };
    }

    return {
      errorMessage: null,
      items: payload.data.images.map((image) => toProjectCarouselItem(image)),
    };
  } catch (error) {
    console.error("QuickSlate carousel feed fetch failed.", error);

    return {
      errorMessage:
        "The shared carousel feed could not be loaded from Website B.",
      items: [],
    };
  }
}
