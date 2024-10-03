import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./(listado)/action-buttons";
import CursoTableContainer from "./(listado)/curso-table-container";
import { Suspense, useMemo } from "react";
import LoadingCursosTable from "./(listado)/loading-curso-table";
import { inputGetCursos } from "@/shared/filters/cursos-filter.schema";
import React from "react";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetCursos.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Listado de cursos</h3>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingCursosTable />}>
        <CursoTableContainer filters={filters} filterByUser={false} />
      </Suspense>
    </>
  );
}
