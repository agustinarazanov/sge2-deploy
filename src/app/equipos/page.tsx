import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./(listado)/action-buttons";
import EquiposTableContainer from "./(listado)/equipos-table-container";
import { Suspense, useMemo } from "react";
import LoadingEquiposTable from "./(listado)/loading-equipos-table";
import { inputGetEquipos } from "@/shared/filters/equipos-filter.schema";
import PageLayout from "@/components/ui/page-template";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import { EquiposNuevoEquipoModal } from "./(listado)/equipos-nuevo-equipo";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetEquipos.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={EQUIPOS_ROUTE} buttons={<EquiposNuevoEquipoModal />}>
      <ActionButtons filters={filters} />
      <div className="w-full">
        <Suspense key={filter_as_key} fallback={<LoadingEquiposTable />}>
          <EquiposTableContainer filters={filters} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
