import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "./_components/navbar/navbar";
import { Toaster } from "@/components/ui";
import { metadataLayoutPrincipal } from "./metadata";

export const metadata = metadataLayoutPrincipal;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-iphone-60x60.png" />
      <link rel="apple-touch-icon" type="image/png" sizes="60x60" href="/apple-touch-icon-ipad-76x76.png" />
      <link
        rel="apple-touch-icon"
        type="image/png"
        sizes="114x114"
        href="/apple-touch-icon-iphone-retina-120x120.png"
      />
      <link rel="apple-touch-icon" type="image/png" sizes="144x144" href="/apple-touch-icon-ipad-retina-152x152.png" />
      <body>
        <TRPCReactProvider>
          <header className="sticky top-0 z-40 bg-white">
            <Navbar />
          </header>
          <Toaster position="top-right" duration={3000} />
          {children}
          <SpeedInsights />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
