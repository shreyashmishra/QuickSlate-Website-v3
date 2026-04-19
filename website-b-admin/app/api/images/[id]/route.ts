import { jsonError, jsonOk } from "@/lib/api/http";
import { requireApiAuthorizedUser } from "@/lib/auth/session";
import { softDeleteImageForUser, updateImageForUser } from "@/lib/images/service";

export const runtime = "nodejs";

type ImageRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: ImageRouteContext,
) {
  try {
    const user = await requireApiAuthorizedUser();
    const { id } = await context.params;
    const body = await request.json();
    const data = await updateImageForUser(user, id, body);

    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: ImageRouteContext,
) {
  try {
    const user = await requireApiAuthorizedUser();
    const { id } = await context.params;
    const data = await softDeleteImageForUser(user, id);

    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
