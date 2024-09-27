import { api } from "@/trpc/server";
import { type z } from "zod";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reservas-filter.schema";
import { LaboratorioAbiertoReservaTable } from "./table";

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
