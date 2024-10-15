import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import MateriasTableContainer from "./_components/materias-table-container";
import LoadingMateriasTable from "./_components/loading-materia-table";
import { inputGetMaterias } from "@/shared/filters/materia-filter.schema";
import { ActionButtons } from "./_components/action-buttons";
import React from "react";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetMaterias.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Listado de materias</h3>{" "}
      {/* Cambia el título */}
      <ActionButtons />
      <Suspense key={filter_as_key} fallback={<LoadingMateriasTable />}>
        <MateriasTableContainer /> {/* Asegúrate de pasar los filtros al contenedor */}
      </Suspense>
    </>
  );
}
