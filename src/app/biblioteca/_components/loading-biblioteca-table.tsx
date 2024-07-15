import LoadingTable from "@/components/ui/table/loading-table";
import { getColumnsNames } from "../_table/columns";
import LoadingPagination from "@/components/ui/table/loading-pagination";

export default function LoadingBibliotecaTable() {
  const columns = getColumnsNames();

  return (
    <>
      <LoadingTable columns={columns} rowsLength={10} />

      <LoadingPagination />
    </>
  );
}
