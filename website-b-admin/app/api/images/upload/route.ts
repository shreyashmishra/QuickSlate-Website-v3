import { jsonError, jsonOk } from "@/lib/api/http";
import { requireApiAuthorizedUser } from "@/lib/auth/session";
import { uploadImageForUser } from "@/lib/images/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireApiAuthorizedUser();
    const formData = await request.formData();
    const data = await uploadImageForUser(user, formData);

    return jsonOk(data, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
