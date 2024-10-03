import LoadingTable from "@/components/ui/table/loading-table";
import LoadingPagination from "@/components/ui/table/loading-pagination";
import { getColumnsNames } from "./columns";
import React from "react";
export default function LoadingCursosTable() {
  const columns = getColumnsNames();

  return (
    <>
      <LoadingTable columns={columns} rowsLength={10} />

      <LoadingPagination />
    </>
  );
}
