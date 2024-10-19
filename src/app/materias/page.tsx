import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import MateriasTableContainer from "./_components/materias-table-container";
import LoadingMateriasTable from "./_components/loading-materia-table";
import { inputGetMaterias } from "@/shared/filters/materia-filter.schema";
import React from "react";
import PageLayout from "@/components/ui/page-template";
import { MATERIA_ROUTE } from "@/shared/server-routes";
import NuevaMateria from "./_components/materia-new-materia";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetMaterias.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={MATERIA_ROUTE} buttons={<NuevaMateria />}>
      <Suspense key={filter_as_key} fallback={<LoadingMateriasTable />}>
        <MateriasTableContainer /> {/* Asegúrate de pasar los filtros al contenedor */}
      </Suspense>
    </PageLayout>
  );
}
