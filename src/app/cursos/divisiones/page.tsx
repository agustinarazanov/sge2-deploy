import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import DivisionesTableContainer from "./_components/divisiones-table-container";
import LoadingDivisionesTable from "./_components/loading-division-table";
import { inputGetDivisiones } from "@/shared/filters/divisiones-filter.schema";
import { ActionButtons } from "./_components/action-buttons";
import React from "react";
type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetDivisiones.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Listado de divisiones</h3>
      <ActionButtons />
      <Suspense key={filter_as_key} fallback={<LoadingDivisionesTable />}>
        {" "}
        <DivisionesTableContainer />
      </Suspense>
    </>
  );
}
