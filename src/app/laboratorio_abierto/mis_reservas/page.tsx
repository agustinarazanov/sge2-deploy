import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ActionButtonsPrestamos } from "../(listado)/action-redirect-prestamos";
import LoadingBibliotecaPrestamosTable from "../(listado)/loading-laboratorio-abierto-reservas-table";
import LaboratorioAbiertoSolicitudesTableContainer from "../(listado)/reservas-table-container";
import { inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";
import PageLayout from "@/components/ui/page-template";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllSolicitudesReservaLaboratorioAbierto.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={LABORATORIO_ABIERTO_ROUTE}>
      <ActionButtonsPrestamos filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaPrestamosTable />}>
        <LaboratorioAbiertoSolicitudesTableContainer filters={filters} filterByUser />
      </Suspense>
    </PageLayout>
  );
}
