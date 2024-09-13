import LoadingTable from "@/components/ui/table/loading-table";
import LoadingPagination from "@/components/ui/table/loading-pagination";
import { getColumnasPrestamoNames } from "./columns-prestamo";

export default function LoadingBibliotecaPrestamosTable() {
  const columns = getColumnasPrestamoNames();

  return (
    <>
      <LoadingTable columns={columns} rowsLength={10} />

      <LoadingPagination />
    </>
  );
}
