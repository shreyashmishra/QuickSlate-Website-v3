import type { ReactNode } from "react";
import { connection } from "next/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAuthorizedUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await connection();

  const user = await requireAuthorizedUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
