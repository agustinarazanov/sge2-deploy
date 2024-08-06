import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingAdminUsuariosTable from "./_components/table/loading-admin-table";
import { AdminUsuariosActionButtons } from "./_components/action-button/action-buttons";
import AdminUsuariosTableContainer from "./_components/table/roles-table-container";
import { adminUsuariosColumnas } from "./_components/table/columns";
import { inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetUsuarios.parse(searchParams);

  const filter_as_key = JSON.stringify(filters);

  return (
    <>
      <AdminUsuariosActionButtons filters={filters} />

      <Suspense key={filter_as_key} fallback={<LoadingAdminUsuariosTable columns={adminUsuariosColumnas} />}>
        <AdminUsuariosTableContainer filters={filters} />
      </Suspense>
    </>
  );
}
