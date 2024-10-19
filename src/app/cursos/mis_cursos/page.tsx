import { Suspense, useMemo } from "react";
import LoadingCursosTable from "../(listado)/loading-curso-table";
import CursoTableContainer from "../(listado)/curso-table-container";
import { ActionButtons } from "../(listado)/action-buttons";
import { inputGetCursos } from "@/shared/filters/cursos-filter.schema";
import { type ReadonlyURLSearchParams } from "next/navigation";
import PageLayout from "@/components/ui/page-template";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import { CursosNuevoCurso } from "../(listado)/cursos-new-curso";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetCursos.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout buttons={<CursosNuevoCurso />} route={CURSOS_ROUTE}>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingCursosTable />}>
        <CursoTableContainer filters={filters} filterByUser={true} />
      </Suspense>
    </PageLayout>
  );
}
