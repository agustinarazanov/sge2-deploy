"use client";

import { Button, DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";

import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { type SortingState } from "@tanstack/react-table";
import { useReservasLaboratorioAbiertoQueryParam } from "../_hooks/use-reserva-laboratorio-abierto-query-param";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reservas-filter.schema";
import { getColumnasReservasLaboratorioAbierto } from "./columns-reserva";
import { PrinterIcon } from "lucide-react";
import { getDateISO } from "@/shared/get-date";
import { VerReservaModal } from "./ver-reserva";

type LaboratorioAbiertoReservaData = RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"];
type reservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;

type LaboratorioAbiertoTableProps = {
  data: LaboratorioAbiertoReservaData;
  filters: reservaFilters;
  filterByUser?: boolean;
};

const mockData: LaboratorioAbiertoReservaData = [
  {
    laboratorio: {
      id: 1,
      nombre: "Laboratorio 1",
      sedeId: 1,
      tienePc: true,
      esReservable: true,
      laboratorioAbiertoTipo: null,
      fechaCreacion: getDateISO("2023-01-01T00:00:00.000Z"),
      fechaModificacion: getDateISO("2023-01-01T00:00:00.000Z"),
      usuarioCreadorId: "user1",
      usuarioModificadorId: "user2",
    },
    reserva: {
      id: 1,
      fechaCreacion: getDateISO("2023-01-01T00:00:00.000Z"),
      fechaHoraInicio: getDateISO("2023-01-01T00:00:00.000Z"),
      fechaHoraFin: getDateISO("2023-01-01T00:00:00.000Z"),
      usuarioSolicito: { id: 1, nombre: "Usuario 1", apellido: "Apellido 1" },
      estatus: "PENDIENTE",
      usuarioAprobador: null,
      usuarioRenovo: null,
      usuarioRecibio: null,
    },
  },
];

export const LaboratorioAbiertoReservaTable = ({ data, filters, filterByUser }: LaboratorioAbiertoTableProps) => {
  const { pagination, sorting, onSortingChange, onPaginationChange } = useReservasLaboratorioAbiertoQueryParam(filters);

  const columns = getColumnasReservasLaboratorioAbierto({ filterByUser });

  return (
    <>
      <DataTable
        data={mockData ?? []}
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
                <VerReservaModal reservaID={original.reserva.id} />

                {true && (
                  <Button
                    title="Imprimir"
                    variant="icon"
                    color="ghost"
                    icon={PrinterIcon}
                    onClick={() => window.print()}
                  />
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
