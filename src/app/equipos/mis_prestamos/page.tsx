import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ActionButtonsPrestamos } from "../(listado)/action-redirect-prestamos";
import LoadingEquiposPrestamosTable from "../(listado)/loading-equipos-prestamos-table";
import EquiposPrestamosTableContainer from "../prestamos/_components/prestamos-table-container";
import { inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";
import PageLayout from "@/components/ui/page-template";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllPrestamosEquipos.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={EQUIPOS_ROUTE}>
      <ActionButtonsPrestamos filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingEquiposPrestamosTable />}>
        <EquiposPrestamosTableContainer filters={filters} filterByUser />
      </Suspense>
    </PageLayout>
  );
}
