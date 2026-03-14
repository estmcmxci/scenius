import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scenius",
  description: "Reputation-weighted prediction market for independent music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
