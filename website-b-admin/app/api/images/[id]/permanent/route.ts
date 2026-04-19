import { jsonError, jsonOk } from "@/lib/api/http";
import { requireApiAuthorizedUser } from "@/lib/auth/session";
import { permanentlyDeleteImageForUser } from "@/lib/images/service";

export const runtime = "nodejs";

type PermanentImageRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: PermanentImageRouteContext,
) {
  try {
    const user = await requireApiAuthorizedUser();
    const { id } = await context.params;
    const data = await permanentlyDeleteImageForUser(user, id);

    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
