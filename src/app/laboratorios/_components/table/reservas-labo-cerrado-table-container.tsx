import { api } from "@/trpc/server";
import { type z } from "zod";
import { type inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { LaboratorioCerradoReservaTable } from "./reserva-labo-cerrado-table";

type LaboratorioCerradoReservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type LaboratorioCerradoReservasTableContainerProps = {
  filters: LaboratorioCerradoReservaFilters;
  filterByUser?: boolean;
};

export default async function LaboratorioCerradoSolicitudesTableContainer({
  filters,
  filterByUser,
}: LaboratorioCerradoReservasTableContainerProps) {
  if (filterByUser) {
    filters = {
      ...filters,
      filtrByUserId: "true",
    };
  }

  const reservas = await api.reservas.reservarLaboratorioCerrado.getAll(filters);

  return <LaboratorioCerradoReservaTable data={reservas} filters={filters} filterByUser={filterByUser} />;
}
