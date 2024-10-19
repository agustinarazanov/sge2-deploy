import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import DivisionesTableContainer from "./_components/divisiones-table-container";
import LoadingDivisionesTable from "./_components/loading-division-table";
import { inputGetDivisiones } from "@/shared/filters/divisiones-filter.schema";
import React from "react";
import PageLayout from "@/components/ui/page-template";
import { NuevaDivision } from "./_components/division-new-division";
import { CURSOS_ROUTE } from "@/shared/server-routes";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetDivisiones.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout title={"Divisiones"} routes={CURSOS_ROUTE.subRutas} button={<NuevaDivision />}>
      <Suspense key={filter_as_key} fallback={<LoadingDivisionesTable />}>
        {" "}
        <DivisionesTableContainer />
      </Suspense>
    </PageLayout>
  );
}
