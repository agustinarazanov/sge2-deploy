import { api } from "@/trpc/server";
import { type z } from "zod";
import { LaboratorioAbiertoReservaTable } from "./table";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

type LaboratorioAbiertoReservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;

type LaboratorioAbiertoReservasTableContainerProps = {
  filters: LaboratorioAbiertoReservaFilters;
  filterByUser?: boolean;
};

export default async function LaboratorioAbiertoSolicitudesTableContainer({
  filters,
  filterByUser,
}: LaboratorioAbiertoReservasTableContainerProps) {
  if (filterByUser) {
    filters = {
      ...filters,
      filtrByUserId: "true",
    };
  }

  const reservas = await api.reservas.reservaLaboratorioAbierto.getAll(filters);

  return <LaboratorioAbiertoReservaTable data={reservas} filters={filters} filterByUser={filterByUser} />;
}
