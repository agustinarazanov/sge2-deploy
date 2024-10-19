"use server";
import { TienePermiso } from "../tienePermiso";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return <TienePermiso permisos={[]}>{children}</TienePermiso>;
}
