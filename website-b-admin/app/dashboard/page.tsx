import { ImageManager } from "@/components/dashboard/image-manager";
import { requireAuthorizedUser } from "@/lib/auth/session";
import { getImageListPayload } from "@/lib/images/service";

export default async function DashboardPage() {
  const user = await requireAuthorizedUser();
  const initialData = await getImageListPayload(user, "active");

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-stone-200 bg-white/82 p-6 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-stone-600">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Welcome to the QuickSlate admin area.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              You&apos;re signed in and approved. Upload and manage images for
              the QuickSlate website below.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50 px-4 py-3">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-700">
              Status
            </p>
            <p className="mt-2 text-lg font-semibold text-stone-950">
              Everything&apos;s live
            </p>
            <p className="mt-1 max-w-xs text-sm leading-6 text-stone-600">
              Upload, edit, and delete images. Changes go live on the carousel.
            </p>
          </div>
        </div>
      </div>

      <ImageManager initialData={initialData} />
    </section>
  );
}
