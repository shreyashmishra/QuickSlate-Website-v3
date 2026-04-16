import { jsonError, jsonOk } from "@/lib/api/http";
import { getPublicImageFeedPayload } from "@/lib/images/public-feed";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await getPublicImageFeedPayload(searchParams);

    return jsonOk(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
