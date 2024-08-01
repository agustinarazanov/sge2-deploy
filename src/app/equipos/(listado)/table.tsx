"use client";

import { DataTable } from "@/components/ui";
import RemoveEquipoModal from "./remove-equipo";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { useEquiposQueryParam } from "../_hooks/use-equipos-query-param";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { EditarEquipoModal } from "./edit-equipo";
import { type SortingState } from "@tanstack/react-table";
import { getEquiposColumnas } from "./columns";
import { type inputGetEquipos } from "@/shared/equipos-filter.schema";

type EquiposData = RouterOutputs["equipos"]["getAll"];
type EquiposFilters = z.infer<typeof inputGetEquipos>;

type EquiposTableProps = {
  data: EquiposData;
  filters: EquiposFilters;
};

export const EquiposTable = ({ data, filters }: EquiposTableProps) => {
  const { refresh, pagination, sorting, onSortingChange, onPaginationChange } = useEquiposQueryParam(filters);

  const columns = getEquiposColumnas();

  // TODO: Implement resizing
  return (
    <>
      <DataTable
        data={data.equipos ?? []}
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
                <EditarEquipoModal equipoId={original.id} />
                <RemoveEquipoModal equipoId={original.id} nombre={original.tipo.nombre} onSubmit={refresh} />
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
