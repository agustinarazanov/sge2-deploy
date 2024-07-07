"use client";

import { DataTable } from "@/components/ui";
import { getColumns } from "../_table/columns";
import RemoveLibroModal from "../_table/remove-libro";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { type SortingState } from "@tanstack/react-table";
import { changeSorting, getSorting } from "../_queryParams";
import { useBibliotecaQueryParam } from "../_hooks/use-biblioteca-query-param";
import { useEffect, useState } from "react";

type LibroData = RouterOutputs["biblioteca"]["getAll"][number];
type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type BibliotecaTableProps = {
  libros: LibroData[];
  filters: BibliotecaFilters;
};

export const BibliotecaTable = ({ libros, filters }: BibliotecaTableProps) => {
  const router = useBibliotecaQueryParam();
  const columns = getColumns();

  const handleCambioEnBiblioteca = () => router.refresh();

  const [sorting, setSorting] = useState<SortingState>(getSorting(filters));

  useEffect(() => {
    const newFilters = changeSorting(filters, sorting);

    router.changeQueryParams(newFilters);

    console.log({ newFilters, sorting });
  }, [filters, router, sorting]);

  return (
    <>
      {JSON.stringify({ sorting }, null, 4)}
      <DataTable
        data={libros ?? []}
        columns={columns}
        paginationConfig={{ pageSize: true, selectedRows: false, pageNumber: true }}
        manualSorting
        config={{ sorting, onSortingChange: setSorting }}
        action={{
          cell({ original }) {
            return (
              <RemoveLibroModal libroId={original.id} nombre={original.titulo} onSubmit={handleCambioEnBiblioteca} />
            );
          },
        }}
      />
    </>
  );
};
