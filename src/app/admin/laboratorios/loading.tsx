import { Skeleton } from "@/components/ui/skeleton";
import LoadingAdminTable from "./_components/table/loading-admin-table";
import { adminLaboratoriosColumnas } from "./_components/table/columns";

export default function BibliotecaLoading() {
  return (
    <>
      <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5 md:space-y-0">
        <div className="relative flex w-full flex-row justify-end md:w-auto md:basis-1/3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="w-full md:basis-1/3">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <LoadingAdminTable columns={adminLaboratoriosColumnas} />
    </>
  );
}
