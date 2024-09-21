import { api } from "@/trpc/server";
import { CursosTable } from "./table";
import { type z } from "zod";
import { type inputGetCursos } from "@/shared/filters/cursos-filter.schema";

type CursosFilters = z.infer<typeof inputGetCursos>;

type CursosTableContainerProps = {
  filters: CursosFilters;
  filterByUser?: boolean;
};

export default async function CursoTableContainer({ filters, filterByUser }: CursosTableContainerProps) {
  if (filterByUser) {
    filters = {
      ...filters,
      filtrByUserId: "true",
    };
  }
  const data = await api.cursos.getAll(filters);
  return <CursosTable data={data} filters={filters} />;
}
