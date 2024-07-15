import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./_components/action-buttons";
import BibliotecaTableContainer from "./_components/biblioteca-table-container";
import { inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { Suspense } from "react";
import LoadingBibliotecaTable from "./_components/loading-biblioteca-table";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetBooks.parse(searchParams);

  const filter_as_key = JSON.stringify(filters);

  return (
    <>
      <ActionButtons />
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaTable />}>
        <BibliotecaTableContainer filters={filters} />
      </Suspense>
    </>
  );
}
