"use client";

import { DataTable } from "@/components/ui";
import RemoverTipoModal from "./remove-tipo";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { EditarTipoModal } from "./edit-tipo";
import { type SortingState } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { useTiposQueryParam } from "../../_hooks/use-tipos-query-param";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { type inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";

type TiposData = RouterOutputs["equipos"]["getAllTipos"];
type TiposFilters = z.infer<typeof inputGetTipos>;

type TiposTableProps = {
  data: TiposData;
  filters: TiposFilters;
};

export const TiposTable = ({ data, filters }: TiposTableProps) => {
  const { refresh, sorting, pagination, onSortingChange, onPaginationChange } = useTiposQueryParam(filters);

  const columns = getColumns();

  return (
    <>
      <DataTable
        data={data.tipos ?? []}
        columns={columns}
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        manualSorting
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
                <EditarTipoModal tipoId={original.id} />
                <RemoverTipoModal
                  tipoId={original.id}
                  nombre={original.nombre ?? ""}
                  imagen={original.imagen ?? ""}
                  onSubmit={refresh}
                />
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
