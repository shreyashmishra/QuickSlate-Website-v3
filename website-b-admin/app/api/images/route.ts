import { jsonError, jsonOk } from "@/lib/api/http";
import { requireApiAuthorizedUser } from "@/lib/auth/session";
import { getImageListPayload } from "@/lib/images/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireApiAuthorizedUser();
    const { searchParams } = new URL(request.url);
    const data = await getImageListPayload(user, searchParams.get("status"));

    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
