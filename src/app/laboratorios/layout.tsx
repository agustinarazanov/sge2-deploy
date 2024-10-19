"use server";

import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { INICIO_ROUTE } from "@/shared/server-routes";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function RootLayout({ children, modal }: LayoutProps) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(INICIO_ROUTE.href);
    return null;
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
