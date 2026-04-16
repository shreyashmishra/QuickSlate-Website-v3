import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { HttpError } from "@/lib/api/http";
import { getServerEnv } from "@/lib/server-env";

declare global {
  var __quickSlateStorageClient: SupabaseClient | undefined;
}

function getStorageClient() {
  if (!globalThis.__quickSlateStorageClient) {
    const env = getServerEnv();

    globalThis.__quickSlateStorageClient = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return globalThis.__quickSlateStorageClient;
}

function getBucketName() {
  return getServerEnv().SUPABASE_STORAGE_BUCKET;
}

export async function uploadStorageObject(args: {
  contentType: string;
  fileBytes: Buffer;
  storagePath: string;
}) {
  const client = getStorageClient();
  const bucket = getBucketName();
  const { error } = await client.storage.from(bucket).upload(args.storagePath, args.fileBytes, {
    cacheControl: "3600",
    contentType: args.contentType,
    upsert: false,
  });

  if (error) {
    throw new HttpError(
      500,
      "storage_upload_failed",
      `Supabase Storage upload failed: ${error.message}`,
    );
  }

  const {
    data: { publicUrl },
  } = client.storage.from(bucket).getPublicUrl(args.storagePath);

  return {
    publicUrl,
    storagePath: args.storagePath,
  };
}

export async function removeStorageObject(storagePath: string) {
  const client = getStorageClient();
  const bucket = getBucketName();
  const { error } = await client.storage.from(bucket).remove([storagePath]);

  if (error) {
    throw new HttpError(
      500,
      "storage_delete_failed",
      `Supabase Storage delete failed: ${error.message}`,
    );
  }
}
