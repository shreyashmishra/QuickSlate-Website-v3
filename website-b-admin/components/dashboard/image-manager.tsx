"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import type {
  ImageDeleteResponse,
  ImageListFilter,
  ImageListPayload,
  ImageListResponse,
  ImageMutationResponse,
} from "@/types/images";

type ConfirmState =
  | {
      id: string;
      title: string;
      description: string;
      endpoint: string;
      method: "DELETE";
    }
  | null;

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isApiSuccess<T extends { ok: boolean }>(
  payload: T,
): payload is T & { ok: true } {
  return payload.ok;
}

export function ImageManager({
  initialData,
}: Readonly<{
  initialData: ImageListPayload;
}>) {
  const [data, setData] = useState(initialData);
  const [statusMessage, setStatusMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const canViewDeleted = useMemo(
    () => data.currentUserRole === "admin" || data.counts.deleted > 0,
    [data.counts.deleted, data.currentUserRole],
  );

  async function refreshImages(nextFilter: ImageListFilter = data.filter) {
    startRefreshTransition(async () => {
      const response = await fetch(`/api/images?status=${nextFilter}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as ImageListResponse;

      if (!response.ok || !isApiSuccess(payload)) {
        setStatusMessage({
          text: payload.ok ? "Failed to refresh images." : payload.error.message,
          tone: "error",
        });
        return;
      }

      setData(payload.data);
    });
  }

  async function handleUploadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    if (!selectedFile) {
      setStatusMessage({
        text: "Select an image file before uploading.",
        tone: "error",
      });
      return;
    }

    startUploadTransition(async () => {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("title", title);
      formData.set("caption", caption);
      formData.set("altText", altText);

      const response = await fetch("/api/images/upload", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json()) as ImageMutationResponse;

      if (!response.ok || !isApiSuccess(payload)) {
        setStatusMessage({
          text: payload.ok ? "Upload failed." : payload.error.message,
          tone: "error",
        });
        return;
      }

      setSelectedFile(null);
      setTitle("");
      setCaption("");
      setAltText("");
      setStatusMessage({
        text: payload.data.message,
        tone: "success",
      });
      await refreshImages("active");
    });
  }

  async function saveImageMetadata(imageId: string, fields: Record<string, unknown>) {
    setBusyImageId(imageId);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        body: JSON.stringify(fields),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const payload = (await response.json()) as ImageMutationResponse;

      if (!response.ok || !isApiSuccess(payload)) {
        setStatusMessage({
          text: payload.ok ? "Save failed." : payload.error.message,
          tone: "error",
        });
        return;
      }

      setStatusMessage({
        text: payload.data.message,
        tone: "success",
      });
      await refreshImages(data.filter);
    } finally {
      setBusyImageId(null);
    }
  }

  async function runConfirmedDelete() {
    if (!confirmState) {
      return;
    }

    setBusyImageId(confirmState.id);
    setStatusMessage(null);

    try {
      const response = await fetch(confirmState.endpoint, {
        method: confirmState.method,
      });
      const payload = (await response.json()) as ImageDeleteResponse;

      if (!response.ok || !isApiSuccess(payload)) {
        setStatusMessage({
          text: payload.ok ? "Delete failed." : payload.error.message,
          tone: "error",
        });
        return;
      }

      setStatusMessage({
        text: payload.data.message,
        tone: "success",
      });
      setConfirmState(null);
      await refreshImages(data.filter);
    } finally {
      setBusyImageId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white/82 p-6 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-stone-600">
              Upload images
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Add images to the QuickSlate media library.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              Supported formats: jpg, png, webp. Max size:{" "}
              {formatBytes(data.maxUploadBytes)}.
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-emerald-900/10 bg-emerald-50 px-4 py-3 text-sm text-stone-700">
            Bucket: <span className="font-mono">{data.storageBucket}</span>
          </div>
        </div>

        <form className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]" onSubmit={handleUploadSubmit}>
          <div
            className={`rounded-[1.75rem] border-2 border-dashed p-5 transition ${
              dragActive
                ? "border-emerald-600 bg-emerald-50"
                : "border-stone-300 bg-stone-50/80"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              const droppedFile = event.dataTransfer.files.item(0);

              if (droppedFile) {
                setSelectedFile(droppedFile);
              }
            }}
          >
            <label className="flex cursor-pointer flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-stone-600">
                Drag and drop or browse
              </span>
              <span className="text-lg font-medium text-stone-950">
                Pick an image to upload
              </span>
              <span className="text-sm leading-6 text-stone-600">
                Your original filename won&apos;t be used — we generate a clean
                path on upload.
              </span>
              <input
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                type="file"
              />
              <span className="inline-flex w-fit items-center rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-stone-50">
                Choose File
              </span>
            </label>

            {selectedFile ? (
              <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-white p-4">
                <p className="font-medium text-stone-950">{selectedFile.name}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {selectedFile.type || "unknown type"} · {formatBytes(selectedFile.size)}
                </p>
                {previewUrl ? (
                  <Image
                    alt="Selected upload preview"
                    className="mt-4 h-56 w-full rounded-[1.25rem] object-cover"
                    height={720}
                    src={previewUrl}
                    unoptimized
                    width={1280}
                  />
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-white/70 p-6 text-sm leading-7 text-stone-500">
                No file selected yet.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-800">
                Title
              </span>
              <input
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Homepage hero image"
                value={title}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-800">
                Caption
              </span>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600"
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Short descriptive caption"
                value={caption}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-800">
                Alt text
              </span>
              <input
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600"
                onChange={(event) => setAltText(event.target.value)}
                placeholder="Describe the image for accessibility"
                value={altText}
              />
            </label>

            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUploading}
              type="submit"
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </form>
      </section>

      {statusMessage ? (
        <div
          className={`rounded-[1.5rem] border px-4 py-3 text-sm ${
            statusMessage.tone === "success"
              ? "border-emerald-900/10 bg-emerald-50 text-emerald-800"
              : "border-rose-900/10 bg-rose-50 text-rose-800"
          }`}
        >
          {statusMessage.text}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-stone-200 bg-white/82 p-6 shadow-[0_24px_80px_rgba(24,33,28,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-stone-600">
              Image library
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              All uploads
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                data.filter === "active"
                  ? "bg-stone-950 text-stone-50"
                  : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
              }`}
              onClick={() => refreshImages("active")}
              type="button"
            >
              Active ({data.counts.active})
            </button>
            {canViewDeleted ? (
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  data.filter === "deleted"
                    ? "bg-stone-950 text-stone-50"
                    : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                }`}
                onClick={() => refreshImages("deleted")}
                type="button"
              >
                Deleted ({data.counts.deleted})
              </button>
            ) : null}
          </div>
        </div>

        {isRefreshing ? (
          <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm text-stone-600">
            Refreshing images...
          </div>
        ) : null}

        {data.images.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50/80 px-6 py-12 text-center">
            <h3 className="text-xl font-semibold tracking-tight text-stone-950">
              {data.filter === "active"
                ? "No active images yet."
                : "No deleted images in this view."}
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              {data.filter === "active"
                ? "Upload an image above to get started."
                : "Soft-deleted images will show up here."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {data.images.map((image) => {
              const isBusy = busyImageId === image.id;

              return (
                <article
                  className="rounded-[1.75rem] border border-stone-200 bg-stone-50/90 p-5"
                  key={`${image.id}-${image.updatedAt}-${image.deletedAt ?? "active"}`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row">
                    <Image
                      alt={image.altText ?? image.title ?? "Uploaded image"}
                      className="h-52 w-full rounded-[1.35rem] object-cover lg:w-60"
                      height={520}
                      sizes="(max-width: 1024px) 100vw, 240px"
                      src={image.publicUrl}
                      width={520}
                    />

                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]">
                        <span className="rounded-full bg-stone-200 px-3 py-1 text-stone-700">
                          {image.deletedAt ? "Soft deleted" : "Active"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 ${
                            image.isVisible
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {image.isVisible ? "Visible" : "Hidden"}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-stone-600">
                          {image.uploadedByEmail}
                        </span>
                      </div>

                      <div className="grid gap-3">
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                            Title
                          </span>
                          <input
                            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600 disabled:bg-stone-100"
                            defaultValue={image.title ?? ""}
                            disabled={!image.permissions.canEditMetadata || isBusy}
                            id={`${image.id}-title`}
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                            Caption
                          </span>
                          <textarea
                            className="min-h-24 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600 disabled:bg-stone-100"
                            defaultValue={image.caption ?? ""}
                            disabled={!image.permissions.canEditMetadata || isBusy}
                            id={`${image.id}-caption`}
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                            Alt text
                          </span>
                          <input
                            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600 disabled:bg-stone-100"
                            defaultValue={image.altText ?? ""}
                            disabled={!image.permissions.canEditMetadata || isBusy}
                            id={`${image.id}-altText`}
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex items-center justify-between rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800">
                          <span>Visible</span>
                          <input
                            className="h-4 w-4"
                            defaultChecked={image.isVisible}
                            disabled={!image.permissions.canEditVisibility || isBusy}
                            id={`${image.id}-isVisible`}
                            type="checkbox"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                            Display order
                          </span>
                          <input
                            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-emerald-600 disabled:bg-stone-100"
                            defaultValue={image.displayOrder}
                            disabled={!image.permissions.canEditVisibility || isBusy}
                            id={`${image.id}-displayOrder`}
                            min={0}
                            step={1}
                            type="number"
                          />
                        </label>
                      </div>

                      <div className="grid gap-2 text-xs leading-6 text-stone-500">
                        <p>Created: {formatTimestamp(image.createdAt)}</p>
                        <p>Updated: {formatTimestamp(image.updatedAt)}</p>
                        {image.deletedAt ? (
                          <p>Deleted: {formatTimestamp(image.deletedAt)}</p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {(image.permissions.canEditMetadata ||
                          image.permissions.canEditVisibility) ? (
                          <button
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() =>
                              saveImageMetadata(image.id, {
                                altText: (
                                  document.getElementById(
                                    `${image.id}-altText`,
                                  ) as HTMLInputElement | null
                                )?.value,
                                caption: (
                                  document.getElementById(
                                    `${image.id}-caption`,
                                  ) as HTMLTextAreaElement | null
                                )?.value,
                                displayOrder: Number(
                                  (
                                    document.getElementById(
                                      `${image.id}-displayOrder`,
                                    ) as HTMLInputElement | null
                                  )?.value ?? image.displayOrder,
                                ),
                                isVisible:
                                  (
                                    document.getElementById(
                                      `${image.id}-isVisible`,
                                    ) as HTMLInputElement | null
                                  )?.checked ?? image.isVisible,
                                title: (
                                  document.getElementById(
                                    `${image.id}-title`,
                                  ) as HTMLInputElement | null
                                )?.value,
                              })
                            }
                            type="button"
                          >
                            {isBusy ? "Saving..." : "Save Changes"}
                          </button>
                        ) : null}

                        {image.permissions.canSoftDelete && !image.deletedAt ? (
                          <button
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-amber-900/10 bg-amber-50 px-5 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                            onClick={() =>
                              setConfirmState({
                                description:
                                  "The image will be hidden from the library and won't show in the carousel.",
                                endpoint: `/api/images/${image.id}`,
                                id: image.id,
                                method: "DELETE",
                                title: "Soft delete this image?",
                              })
                            }
                            type="button"
                          >
                            Soft Delete
                          </button>
                        ) : null}

                        {image.permissions.canPermanentDelete ? (
                          <button
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-900/10 bg-rose-50 px-5 text-sm font-medium text-rose-800 transition hover:bg-rose-100"
                            onClick={() =>
                              setConfirmState({
                                description:
                                  "This can't be undone. The file and all its metadata will be permanently removed.",
                                endpoint: `/api/images/${image.id}/permanent`,
                                id: image.id,
                                method: "DELETE",
                                title: "Permanently delete this image?",
                              })
                            }
                            type="button"
                          >
                            Permanent Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {confirmState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
            <h3 className="text-2xl font-semibold tracking-tight text-stone-950">
              {confirmState.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {confirmState.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
                onClick={runConfirmedDelete}
                type="button"
              >
                Confirm
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 text-sm font-medium text-stone-950 transition hover:border-stone-400 hover:bg-stone-50"
                onClick={() => setConfirmState(null)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
