import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";
import { BadgeEstatusReserva } from "@/app/_components/badge-estatus-reserva";

type LaboratorioAbiertoReservaData =
  RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"]["reservas"][number];

export const getColumnasReservasLaboratorioAbierto = ({ filterByUser }: { filterByUser?: boolean }) => {
  const colHelper = createColumnHelper<LaboratorioAbiertoReservaData>();

  const columnasBasicas = [
    colHelper.accessor("id", {
      header: "Reserva #",
    }),
    colHelper.display({
      header: "Fecha",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getDateISOString(reserva.fechaHoraInicio);

        return `${fecha}`;
      },
    }),
    colHelper.accessor("reserva.fechaHoraInicio", {
      header: "Hora Inicio",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getTimeISOString(reserva.fechaHoraInicio);

        return fecha;
      },
    }),
    colHelper.accessor("reserva.fechaHoraFin", {
      header: "Hora Fin",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getTimeISOString(reserva.fechaHoraFin);

        return fecha;
      },
    }),
    colHelper.accessor("concurrentes", {
      header: "Cant. Personas",
    }),
    colHelper.accessor("laboratorioAbiertoTipo", {
      header: "Tipo Laboratorio",
    }),
    colHelper.accessor("reserva.usuarioTutor.apellido", {
      header: "Tutor",
      cell: ({ row }) => {
        const { reserva } = row.original;
        const { usuarioTutor } = reserva;

        if (!usuarioTutor) {
          return <span className="text-center">No asignado</span>;
        }

        return <DatoUsuarioReserva usuario={usuarioTutor} />;
      },
    }),
    colHelper.accessor("especialidad", {
      header: "Especialidad",
    }),
    colHelper.accessor("laboratorio.nombre", {
      header: "Laboratorio",
      cell: ({ row }) => {
        const { laboratorio, reserva } = row.original;
        const { estatus } = reserva;

        if (estatus === "CANCELADA") {
          return <span className="text-center">Cancelada</span>;
        }
        if (estatus === "RECHAZADA") {
          return <span className="text-center">Rechazada</span>;
        }
        if (!laboratorio) {
          return <span className="text-center">Sin informar</span>;
        }

        return laboratorio.nombre;
      },
    }),

    colHelper.accessor("reserva.estatus", {
      header: "Estado",
      cell: ({ row }) => {
        const { estatus } = row.original.reserva;

        return <BadgeEstatusReserva estatus={estatus} />;
      },
    }),
  ] as ColumnDef<LaboratorioAbiertoReservaData>[];

  const columnas = filterByUser ? columnasBasicas : [...columnasBasicas];

  return columnas;
};

export const getColumnasResevaNames = () => {
  return [
    "Préstamo #",
    "Laboratorio",
    "Nombre Laboratorio",
    "Sede",
    "Fecha de solicitud",
    "Inicio de Reserva",
    "Fin de Reserva",
    "Solicitado por",
  ];
};
