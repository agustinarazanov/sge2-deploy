import { api } from "@/trpc/server";
import { type z } from "zod";
import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { BibliotecaPrestamosTable } from "./table";

type BibliotecaPrestamosFilters = z.infer<typeof inputGetAllPrestamosLibros>;

type BibliotecaPrestamosTableContainerProps = {
  filters: BibliotecaPrestamosFilters;
  filterByUser?: boolean;
};

export default async function BibliotecaPrestamosTableContainer({
  filters,
  filterByUser,
}: BibliotecaPrestamosTableContainerProps) {
  if (filterByUser) {
    filters = {
      ...filters,
      filtrByUserId: "true",
    };
  }

  const prestamos = await api.reservas.reservaBiblioteca.getAll(filters);

  return <BibliotecaPrestamosTable data={prestamos} filters={filters} filterByUser={filterByUser} />;
}
