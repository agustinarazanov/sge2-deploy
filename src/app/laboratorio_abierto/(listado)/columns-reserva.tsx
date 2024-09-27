import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getDateISOString } from "@/shared/get-date";
import { Badge } from "@/components/ui/badge";

type LaboratorioAbiertoReservaData =
  RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"]["reservas"][number];

export const getColumnasReservasLaboratorioAbierto = ({ filterByUser }: { filterByUser?: boolean }) => {
  const colHelper = createColumnHelper<LaboratorioAbiertoReservaData>();

  const columnasBasicas = [
    colHelper.accessor("id", {
      header: "Reserva #",
    }),
    colHelper.accessor("laboratorio.id", {
      header: "Laboratorio ID",
    }),
    colHelper.accessor("laboratorio.nombre", {
      header: "Nombre Laboratorio",
    }),
    colHelper.accessor("laboratorio.sedeId", {
      header: "sede",
    }),
    colHelper.accessor("reserva.fechaCreacion", {
      header: "Fecha de solicitud",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getDateISOString(reserva.fechaCreacion);

        return fecha;
      },
    }),
    colHelper.accessor("reserva.fechaHoraInicio", {
      header: "Inicio de reserva",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getDateISOString(reserva.fechaHoraInicio);

        return fecha;
      },
    }),
    colHelper.accessor("reserva.fechaHoraFin", {
      header: "Fin de reserva",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getDateISOString(reserva.fechaHoraFin);

        return fecha;
      },
    }),
    colHelper.accessor("reserva.usuarioSolicito.apellido", {
      header: "Solicitado por",
      cell: ({ row }) => {
        const { reserva } = row.original;
        const { usuarioSolicito } = reserva;

        return <DatoUsuarioReserva usuario={usuarioSolicito} />;
      },
    }),

    colHelper.accessor("reserva.estatus", {
      header: "Estado",
      cell: ({ row }) => {
        const { estatus } = row.original.reserva;
        if (estatus === "PENDIENTE") {
          return <Badge color="danger">Pendiente</Badge>;
        }
        if (estatus === "FINALIZADA") {
          return <Badge color="success">Aprobada</Badge>;
        }
      },
    }),
  ] as ColumnDef<LaboratorioAbiertoReservaData>[];

  const columnas = filterByUser ? columnasBasicas : [...columnasBasicas];

  return columnas;
};

export const getColumnasResevaNames = () => {
  return [
    "Prestamo #",
    "Laboratorio",
    "Nombre Laboratorio",
    "Sede",
    "Fecha de solicitud",
    "Inicio de Reserva",
    "Fin de Reserva",
    "Solicitado por",
  ];
};
