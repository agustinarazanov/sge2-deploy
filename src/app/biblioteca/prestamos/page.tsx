import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ActionButtonsPrestamos } from "../(listado)/action-redirect-prestamos";
import LoadingBibliotecaPrestamosTable from "../(listado)/loading-biblioteca-prestamos-table";
import BibliotecaPrestamosTableContainer from "./_components/prestamos-table-container";
import { inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import PageLayout from "@/components/ui/page-template";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllPrestamosLibros.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={BIBLIOTECA_ROUTE}>
      <ActionButtonsPrestamos filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaPrestamosTable />}>
        <BibliotecaPrestamosTableContainer filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
