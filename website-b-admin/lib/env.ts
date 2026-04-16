import { z } from "zod";

const integerString = z
  .string()
  .trim()
  .regex(/^\d+$/)
  .transform((value) => Number(value));

const serverEnvSchema = z.object({
  APP_BASE_URL: z.string().url(),
  AUTH0_CLIENT_ID: z.string().min(1),
  AUTH0_CLIENT_SECRET: z.string().min(1),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  IMAGE_UPLOAD_MAX_BYTES: integerString.default(10 * 1024 * 1024),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("carousel-images"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = serverEnvSchema.safeParse({
    APP_BASE_URL: process.env.APP_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    IMAGE_UPLOAD_MAX_BYTES: process.env.IMAGE_UPLOAD_MAX_BYTES,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
    SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment variables: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ")}`,
    );
  }

  cachedEnv = parsed.data;

  return cachedEnv;
}
