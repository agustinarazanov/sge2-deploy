"use client";

import { Button, DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { type SortingState } from "@tanstack/react-table";
import { useReservasLaboratorioAbiertoQueryParam } from "../_hooks/use-reserva-laboratorio-abierto-query-param";

import { getColumnasReservasLaboratorioAbierto } from "./columns-reserva";
import { PrinterIcon, TrashIcon } from "lucide-react";
import { VerReservaModal } from "./ver-reserva";
import EditarReservaModal from "./editar-reserva-modal";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

type LaboratorioAbiertoReservaData = RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"];
type reservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;

type LaboratorioAbiertoTableProps = {
  data: LaboratorioAbiertoReservaData;
  filters: reservaFilters;
  filterByUser?: boolean;
};

export const LaboratorioAbiertoReservaTable = ({ data, filters, filterByUser }: LaboratorioAbiertoTableProps) => {
  const { pagination, sorting, onSortingChange, onPaginationChange } = useReservasLaboratorioAbiertoQueryParam(filters);

  const columns = getColumnasReservasLaboratorioAbierto({ filterByUser });

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
                {!filterByUser && <VerReservaModal reservaID={original.reserva.id} />}
                {filterByUser && <EditarReservaModal params={{ id: original.reserva.id }} />}

                <Button
                  title="Imprimir"
                  variant="icon"
                  color="ghost"
                  icon={PrinterIcon}
                  onClick={() => window.print()}
                />

                {/* TODO CREAR COMPONENTE CON ALERT DIALOG */}
                {filterByUser && <Button title="Cancelar reserva" variant="icon" color="danger" icon={TrashIcon} />}
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
