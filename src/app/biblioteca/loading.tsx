import { Button } from "@/components/ui";

import { getColumnsNames } from "./_table/columns";
import LoadingTable from "@/components/ui/table/loading-table";

export default function BibliotecaLoading() {
  const columns = getColumnsNames();

  return (
    <>
      <div className="relative flex w-full flex-row items-center justify-end space-x-1.5">
        <Button color={"primary"} isLoading>
          Nuevo libro
        </Button>
      </div>

      <LoadingTable caption="Cargando Libros..." columns={columns} rowsLength={3} />
    </>
  );
}
