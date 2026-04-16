import type { ReactNode } from "react";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "QuickSlate Admin Portal",
  description:
    "Authenticated admin portal for QuickSlate Website B with Auth0, Prisma, PostgreSQL, and Supabase Storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-[-12rem] top-[-10rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(15,118,110,0.22),_transparent_68%)] blur-3xl" />
          <div className="absolute right-[-8rem] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(217,119,6,0.18),_transparent_70%)] blur-3xl" />
          <div className="absolute bottom-[-10rem] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(20,83,45,0.12),_transparent_72%)] blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
