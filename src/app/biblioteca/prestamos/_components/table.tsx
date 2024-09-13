"use client";

import { Button, DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";

import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { type SortingState } from "@tanstack/react-table";
import { useBibliotecaPrestamosQueryParam } from "../../_hooks/use-biblioteca-prestamo-query-param";
import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { getColumnasPrestamo } from "../../(listado)/columns-prestamo";
import { PrinterIcon } from "lucide-react";

type LibroPrestamoData = RouterOutputs["reservas"]["reservaBiblioteca"]["getAll"];
type BibliotecaFilters = z.infer<typeof inputGetAllPrestamosLibros>;

type BibliotecaTableProps = {
  data: LibroPrestamoData;
  filters: BibliotecaFilters;
};

export const BibliotecaPrestamosTable = ({ data, filters }: BibliotecaTableProps) => {
  const { pagination, sorting, onSortingChange, onPaginationChange } = useBibliotecaPrestamosQueryParam(filters);

  const columns = getColumnasPrestamo();

  return (
    <>
      <DataTable
        data={data.reservas ?? []}
        columns={columns}
        manualSorting
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        config={{
          sorting,
          onSortingChange: (updaterOrValue: SortingState | ((prevState: SortingState) => SortingState)) =>
            onSortingChange(typeof updaterOrValue === "function" ? updaterOrValue([]) : updaterOrValue),
        }}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <Button title="Ver" variant="icon" color="ghost" icon={PrinterIcon} />
                {/* <VerLibroModal libroId={original.id} />
                <EditLibroModal libroId={original.id} /> */}
              </>
            );
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
