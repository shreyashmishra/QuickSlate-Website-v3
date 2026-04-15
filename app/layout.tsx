import type { Metadata } from "next";
import Navbar from "./navbar/navbar";
import "./globals.css";
import "./vars.scss";
import Footer from "./Footer/footer";

export const metadata: Metadata = {
  title: "QuickSlate",
  description: "QuickSlate films, campaigns, shorts, and digital promotion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
