import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingAdminTable from "./_components/table/loading-admin-table";
import { AdminActionButtons } from "./_components/action-button/action-buttons";
import AdminLaboratoriosTableContainer from "./_components/table/laboratorios-table-container";
import { adminLaboratoriosColumnas } from "./_components/table/columns";
import { inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetLaboratorios.parse(searchParams);

  const filter_as_key = JSON.stringify(filters);

  return (
    <>
      <AdminActionButtons filters={filters} />

      <Suspense key={filter_as_key} fallback={<LoadingAdminTable columns={adminLaboratoriosColumnas} />}>
        <AdminLaboratoriosTableContainer filters={filters} />
      </Suspense>
    </>
  );
}
