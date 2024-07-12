import { Button } from "@/components/ui";

import { getColumnsNames } from "./_table/columns";
import LoadingTable from "@/components/ui/table/loading-table";
import LoadingPagination from "@/components/ui/table/loading-pagination";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BibliotecaLoading() {
  const columns = getColumnsNames();

  return (
    <>
      <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5 md:space-y-0">
        <div className="relative flex w-full flex-row justify-end md:w-auto md:basis-1/3">
          <Button color={"primary"} isLoading>
            Nuevo libro
          </Button>
        </div>

        <div className="w-full md:basis-1/3">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <LoadingTable
        caption={
          <div className="mx-auto flex items-center justify-center space-x-2">
            <Loader2 className="h-4 animate-spin" />
            <span>Cargando Libros...</span>
          </div>
        }
        columns={columns}
        rowsLength={3}
      />

      <LoadingPagination />
    </>
  );
}
