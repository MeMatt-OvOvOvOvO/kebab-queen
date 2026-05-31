import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
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
    <html lang="pl" className={plusJakartaSans.className}>
      <body className="min-h-screen" style={{ background: "#F8F5F7" }}>
        {children}
      </body>
    </html>
  );
}
