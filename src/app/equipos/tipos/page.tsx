import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import LoadingTiposTable from "./_components/table/loading-tipos-table";
import { EquiposTiposActionButtons } from "./_components/buttons/action-buttons";
import TiposTableContainer from "./_components/table/tipos-table-container";
import { equiposColumnas } from "./_components/table/columns";
import { inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetTipos.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <EquiposTiposActionButtons filters={filters} />

      <Suspense key={filter_as_key} fallback={<LoadingTiposTable columns={equiposColumnas} />}>
        <TiposTableContainer filters={filters} />
      </Suspense>
    </>
  );
}
