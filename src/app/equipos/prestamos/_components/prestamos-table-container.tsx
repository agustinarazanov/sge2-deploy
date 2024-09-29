import { api } from "@/trpc/server";
import { type z } from "zod";
import { EquiposPrestamosTable } from "./table";
import { type inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type EquiposPrestamosFilters = z.infer<typeof inputGetAllPrestamosEquipos>;

type EquiposPrestamosTableContainerProps = {
  filters: EquiposPrestamosFilters;
  filterByUser?: boolean;
};

export default async function EquiposPrestamosTableContainer({
  filters,
  filterByUser,
}: EquiposPrestamosTableContainerProps) {
  if (filterByUser) {
    filters = {
      ...filters,
      filtrByUserId: "true",
    };
  }

  const prestamos = await api.reservas.reservaEquipo.getAll(filters);

  return <EquiposPrestamosTable data={prestamos} filters={filters} filterByUser={filterByUser} />;
}
