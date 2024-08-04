"use client";

import { DataTable } from "@/components/ui";
import RemoveCursoModal from "./remove-curso";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { useCursosQueryParam } from "../_hooks/use-cursos-query-param";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { EditCursoModal } from "./editar-curso";
import { type SortingState } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { type inputGetCursos } from "@/shared/filters/cursos-filter.schema";

type CursoData = RouterOutputs["cursos"]["getAll"];
type CursosFilters = z.infer<typeof inputGetCursos>;

type CursosTableProps = {
  data: CursoData;
  filters: CursosFilters;
};

export const CursosTable = ({ data, filters }: CursosTableProps) => {
  const { refresh, pagination, sorting, onSortingChange, onPaginationChange } = useCursosQueryParam(filters);

  const columns = getColumns();

  // TODO: Implement resizing
  return (
    <>
      <DataTable
        data={data.cursos ?? []}
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
                <EditCursoModal cursoId={original.id} />
                <RemoveCursoModal cursoId={original.id} nombre={original.division.nombre} onSubmit={refresh} />
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
