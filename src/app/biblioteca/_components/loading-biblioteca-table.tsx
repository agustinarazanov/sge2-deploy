import LoadingTable from "@/components/ui/table/loading-table";
import { Loader2 } from "lucide-react";
import { getColumnsNames } from "../_table/columns";

export default function LoadingBibliotecaTable() {
  const columns = getColumnsNames();

  return (
    <LoadingTable
      caption={
        <div className="mx-auto flex items-center justify-center space-x-2">
          <Loader2 className="h-4 animate-spin" />
          <span>Cargando Libros...</span>
        </div>
      }
      columns={columns}
      rowsLength={10}
    />
  );
}
