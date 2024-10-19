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

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetCursos.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout title="Mis cursos" buttons={<CursosNuevoCurso />} routes={CURSOS_ROUTE.subRutas}>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingCursosTable />}>
        <CursoTableContainer filters={filters} filterByUser={true} />
      </Suspense>
    </PageLayout>
  );
}
