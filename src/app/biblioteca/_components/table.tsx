"use client";

import { DataTable } from "@/components/ui";
import { getColumns } from "../_table/columns";
import RemoveLibroModal from "../_table/remove-libro";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { useBibliotecaQueryParam } from "../_hooks/use-biblioteca-query-param";

type LibroData = RouterOutputs["biblioteca"]["getAll"][number];
type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type BibliotecaTableProps = {
  libros: LibroData[];
  filters: BibliotecaFilters;
};

export const BibliotecaTable = ({ libros, filters }: BibliotecaTableProps) => {
  const { refresh, pagination, sorting, onSortingChange, onPaginationChange } = useBibliotecaQueryParam(filters);

  const columns = getColumns();

  return (
    <>
      <code>{JSON.stringify({ sorting, pagination }, null, 4)}</code>
      <DataTable
        data={libros ?? []}
        columns={columns}
        paginationConfig={{ pageSize: true, selectedRows: false, pageNumber: true }}
        manualSorting
        rowCount={22}
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex - 1}
        config={{
          sorting,
          onSortingChange,
          onPaginationChange,
        }}
        action={{
          cell({ original }) {
            return <RemoveLibroModal libroId={original.id} nombre={original.titulo} onSubmit={refresh} />;
          },
        }}
      />
    </>
  );
};
