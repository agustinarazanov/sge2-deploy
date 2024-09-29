"use client";

import { Button, DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";

import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { type SortingState } from "@tanstack/react-table";
import { useEquiposPrestamosQueryParam } from "../../_hooks/use-equipos-prestamo-query-param";
import { getColumnasPrestamo } from "../../(listado)/columns-prestamo";
import { PrinterIcon } from "lucide-react";
import { type inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type EquipoPrestamoData = RouterOutputs["reservas"]["reservaEquipo"]["getAll"];
type EquiposFilters = z.infer<typeof inputGetAllPrestamosEquipos>;

type EquipoTableProps = {
  data: EquipoPrestamoData;
  filters: EquiposFilters;
  filterByUser?: boolean;
};

export const EquiposPrestamosTable = ({ data, filters, filterByUser }: EquipoTableProps) => {
  const { pagination, sorting, onSortingChange, onPaginationChange } = useEquiposPrestamosQueryParam(filters);

  const columns = getColumnasPrestamo({ filterByUser });

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
          cell() {
            return (
              <>
                {!filterByUser && (
                  <Button title="Ver" variant="icon" color="ghost" icon={PrinterIcon} onClick={() => window.print()} />
                )}
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
