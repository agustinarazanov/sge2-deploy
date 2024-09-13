import { Suspense, useMemo } from "react";
import LoadingCursosTable from "../(listado)/loading-curso-table";
import CursoTableContainer from "../(listado)/curso-table-container";
import { ActionButtons } from "../(listado)/action-buttons";
import { inputGetCursos } from "@/shared/filters/cursos-filter.schema";
import { type ReadonlyURLSearchParams } from "next/navigation";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetCursos.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Mis cursos</h3>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingCursosTable />}>
        <CursoTableContainer filters={filters} filterByUser={true} />
      </Suspense>
    </>
  );
}
