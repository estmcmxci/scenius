import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/components/nav";
import { ParaProvider } from "@/app/providers/para-provider";
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ParaProvider>
          <Nav />
          {children}
          <footer className="border-t border-gray-200 mt-12">
            <div className="mx-auto max-w-2xl px-4 py-4 flex justify-center">
              <Link
                href="/privacy"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </footer>
        </ParaProvider>
      </body>
    </html>
  );
}
