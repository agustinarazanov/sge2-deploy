import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "./_components/navbar/navbar";

export const metadata = {
  title: "SGE",
  description: "Creado por el equipo de SGE con ❤️",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <header>
            <Navbar />
          </header>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
