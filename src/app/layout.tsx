import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "./_components/navbar/navbar";
import { Toaster } from "@/components/ui";

export const metadata = {
  title: "SGE",
  description: "Creado por el equipo de SGE con ❤️",
  icons: "electrical-circuit.png",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <header>
            <Navbar />
          </header>
          <Toaster position="top-right" duration={3000} />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
