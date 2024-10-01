"use client";

import { Button, DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { type SortingState } from "@tanstack/react-table";
import { PrinterIcon } from "lucide-react";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { ReservaEstatus } from "@prisma/client";
import { getColumnasReservasLaboratorioCerrado } from "./reserva-labo-cerrado-columns";
import { useReservasLaboratorioCerradoQueryParam } from "../../_hooks/use-reserva-laboratorio-cerrado-query-param";
import { VerReservaModal } from "../ver-reserva";
import EditarReservaModal from "../editar-reserva-modal";

type LaboratorioCerradoReservaData = RouterOutputs["reservas"]["reservarLaboratorioCerrado"]["getAll"];
type reservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type LaboratorioCerradoTableProps = {
  data: LaboratorioCerradoReservaData;
  filters: reservaFilters;
  filterByUser?: boolean;
};

export const LaboratorioCerradoReservaTable = ({ data, filters, filterByUser }: LaboratorioCerradoTableProps) => {
  const { pagination, sorting, onSortingChange, onPaginationChange } = useReservasLaboratorioCerradoQueryParam(filters);

  const columns = getColumnasReservasLaboratorioCerrado({ filterByUser });

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
            const estaCancelada = original.reserva.estatus === ReservaEstatus.CANCELADA;

            return (
              <>
                {!filterByUser && <VerReservaModal reservaID={original.reserva.id} />}
                {filterByUser && !estaCancelada && <EditarReservaModal params={{ id: original.reserva.id }} />}

                <Button
                  title="Imprimir"
                  variant="icon"
                  color="ghost"
                  icon={PrinterIcon}
                  onClick={() => window.print()}
                />

                {/* TODO CREAR COMPONENTE CON ALERT DIALOG */}
                {/* {filterByUser && <Button title="Cancelar reserva" variant="icon" color="danger" icon={TrashIcon} />} */}
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
