import { api } from "@/trpc/server";
import { CursosTable } from "./table";
import { type z } from "zod";
import { type inputGetCursos } from "@/shared/filters/cursos-filter.schema";
import { getServerAuthSession } from "@/server/auth";

type CursosFilters = z.infer<typeof inputGetCursos>;

type CursosTableContainerProps = {
  filters: CursosFilters;
  filterByUser?: boolean;
};

export default async function CursoTableContainer({ filters, filterByUser }: CursosTableContainerProps) {
  if (filterByUser) {
    filters = {
      ...filters,
      userId: (await getServerAuthSession())?.user.id,
    };
  }
  const data = await api.cursos.getAll(filters);
  return <CursosTable data={data} filters={filters} />;
}
