import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./(listado)/action-buttons";
import CursoTableContainer from "./(listado)/curso-table-container";
import { Suspense, useMemo } from "react";
import LoadingCursosTable from "./(listado)/loading-curso-table";
import { inputGetCursos } from "@/shared/filters/cursos-filter.schema";
import React from "react";
import { CursosNuevoCurso } from "./(listado)/cursos-new-curso";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import PageLayout from "@/components/ui/page-template";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = useMemo(() => inputGetCursos.parse(searchParams), [searchParams]);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);
  return (
    <PageLayout title={"Listado de cursos"} routes={CURSOS_ROUTE.subRutas} buttons={<CursosNuevoCurso />}>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingCursosTable />}>
        <CursoTableContainer filters={filters} filterByUser={false} />
      </Suspense>
    </PageLayout>
  );
}
