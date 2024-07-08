"use client";

import { DataTable } from "@/components/ui";
import { getColumns } from "../_table/columns";
import RemoveLibroModal from "../_table/remove-libro";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { useBibliotecaQueryParam } from "../_hooks/use-biblioteca-query-param";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";

type LibroData = RouterOutputs["biblioteca"]["getAll"];
type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type BibliotecaTableProps = {
  data: LibroData;
  filters: BibliotecaFilters;
};

export const BibliotecaTable = ({ data, filters }: BibliotecaTableProps) => {
  const { refresh, pagination, sorting, onSortingChange, onPaginationChange } = useBibliotecaQueryParam(filters);

  const columns = getColumns();

  return (
    <>
      <DataTable
        data={data.libros ?? []}
        columns={columns}
        manualSorting
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        config={{
          sorting,
          onSortingChange,
        }}
        action={{
          cell({ original }) {
            return <RemoveLibroModal libroId={original.id} nombre={original.titulo} onSubmit={refresh} />;
          },
        }}
      />

      <DataTablePaginationStandalone
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={data.count}
        onChange={onPaginationChange}
      />
    </>
  );
};
