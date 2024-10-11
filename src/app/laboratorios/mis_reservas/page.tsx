import { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import LaboratorioCerradoSolicitudesTableContainer from "../_components/table/reservas-labo-cerrado-table-container";
import LoadingBibliotecaPrestamosTable from "@/app/biblioteca/(listado)/loading-biblioteca-prestamos-table";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaPrestamosTable />}>
        <LaboratorioCerradoSolicitudesTableContainer filters={filters} filterByUser />
      </Suspense>
    </>
  );
}
