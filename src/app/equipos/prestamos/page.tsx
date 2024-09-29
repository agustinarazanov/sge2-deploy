import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ActionButtonsPrestamos } from "../(listado)/action-redirect-prestamos";
import LoadingEquiposPrestamosTable from "../(listado)/loading-equipos-prestamos-table";
import EquiposPrestamosTableContainer from "./_components/prestamos-table-container";
import { inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetAllPrestamosEquipos.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <ActionButtonsPrestamos filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingEquiposPrestamosTable />}>
        <EquiposPrestamosTableContainer filters={filters} />
      </Suspense>
    </>
  );
}
