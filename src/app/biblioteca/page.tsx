import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./(listado)/action-buttons";
import BibliotecaTableContainer from "./(listado)/biblioteca-table-container";
import { inputGetBooks } from "@/shared/filters/biblioteca-filter.schema";
import { Suspense, useMemo } from "react";
import LoadingBibliotecaTable from "./(listado)/loading-biblioteca-table";
import PageLayout from "@/components/ui/page-template";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";
import { BibliotecaNewLibro } from "./(listado)/biblioteca-new-book";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetBooks.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout title={"Listado de libros"} routes={BIBLIOTECA_ROUTE.subRutas} buttons={<BibliotecaNewLibro />}>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaTable />}>
        <BibliotecaTableContainer filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
