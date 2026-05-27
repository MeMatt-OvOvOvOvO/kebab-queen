import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kebab Queen",
  description: "Aplikacja lojalnościowa Kebab Queen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={geist.className}>
      <body className="min-h-screen" style={{ background: "#F8F5F7" }}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
