import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ActionButtonsPrestamos } from "../(listado)/action-redirect-prestamos";
import LoadingBibliotecaPrestamosTable from "../(listado)/loading-laboratorio-abierto-reservas-table";
import { inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reservas-filter.schema";
import LaboratorioAbiertoSolicitudesTableContainer from "../_components/reservas-table-container";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetAllSolicitudesReservaLaboratorioAbierto.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <ActionButtonsPrestamos filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaPrestamosTable />}>
        <LaboratorioAbiertoSolicitudesTableContainer filters={filters} filterByUser />
      </Suspense>
    </>
  );
}
