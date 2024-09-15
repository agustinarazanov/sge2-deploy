import { api } from "@/trpc/server";
import { type z } from "zod";
import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { BibliotecaPrestamosTable } from "./table";
import { getServerAuthSession } from "@/server/auth";

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
      userId: (await getServerAuthSession())?.user.id,
    };
  }

  const prestamos = await api.reservas.reservaBiblioteca.getAll(filters);

  return <BibliotecaPrestamosTable data={prestamos} filters={filters} filterByUser={filterByUser} />;
}
