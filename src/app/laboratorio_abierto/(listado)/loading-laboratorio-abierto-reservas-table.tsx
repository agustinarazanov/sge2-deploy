import LoadingTable from "@/components/ui/table/loading-table";
import LoadingPagination from "@/components/ui/table/loading-pagination";
import { getColumnasResevaNames } from "./columns-reserva";

export default function LoadingLaboratorioAbiertoReservasTable() {
  const columns = getColumnasResevaNames();

  return (
    <>
      <LoadingTable columns={columns} rowsLength={10} />

      <LoadingPagination />
    </>
  );
}
