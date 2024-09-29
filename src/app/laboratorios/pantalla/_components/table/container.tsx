import { api } from "@/trpc/server";
import { PantallaTable } from "./software-table";

export default async function PantallaTableContainer() {
  const reservasEnPantalla = await api.reservas.pantalla.getReservaPorUser();

  return <PantallaTable data={reservasEnPantalla} />;
}
