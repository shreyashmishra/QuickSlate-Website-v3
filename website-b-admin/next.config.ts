import type { NextConfig } from "next";

function getSupabaseRemotePattern() {
  const rawUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!rawUrl) {
    return [];
  }

  try {
    const parsed = new URL(rawUrl);

    return [
      {
        hostname: parsed.hostname,
        pathname: "/storage/v1/object/public/**",
        port: parsed.port,
        protocol: parsed.protocol.replace(":", "") as "http" | "https",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getSupabaseRemotePattern(),
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
