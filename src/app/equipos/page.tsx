import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./(listado)/action-buttons";
import EquiposTableContainer from "./(listado)/equipos-table-container";
import { Suspense, useMemo } from "react";
import LoadingEquiposTable from "./(listado)/loading-equipos-table";
import { inputGetEquipos } from "@/shared/filters/equipos-filter.schema";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetEquipos.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Listado de equipos</h3>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingEquiposTable />}>
        <EquiposTableContainer filters={filters} />
      </Suspense>
    </>
  );
}
