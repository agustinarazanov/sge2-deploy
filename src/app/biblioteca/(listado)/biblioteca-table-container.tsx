import { api } from "@/trpc/server";
import { BibliotecaTable } from "./table";
import { type z } from "zod";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type BibliotecaTableContainerProps = {
  filters: BibliotecaFilters;
};

export default async function BibliotecaTableContainer({ filters }: BibliotecaTableContainerProps) {
  const libros = await api.biblioteca.getAll(filters);

  return <BibliotecaTable data={libros} filters={filters} />;
}
