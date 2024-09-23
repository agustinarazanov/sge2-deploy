import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getDateISOString } from "@/shared/get-date";
import RenovarPrestamoLibroModal from "../_components/modal-gestion-reserva";

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
    colHelper.accessor("reserva.usuarioAprobador.apellido", {
      header: "Aprobado por",
      cell: ({ row }) => {
        const { reserva } = row.original;
        const { usuarioAprobador } = reserva;

        return <DatoUsuarioReserva usuario={usuarioAprobador} />;
      },
    }),
  ] as ColumnDef<LaboratorioAbiertoReservaData>[];

  const columnasGeneral = [
    colHelper.display({
      header: "Aprobar",
      cell: ({ row }) => {
        const { reserva, laboratorioId } = row.original;
        const { estatus } = reserva;

        if (estatus === "FINALIZADA") {
          return <span className="text-center">-</span>;
        }

        if (estatus === "PENDIENTE") {
          return <RenovarPrestamoLibroModal reservaID={laboratorioId} />;
        }

        return <span className="text-center">Sin información</span>;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
  ] as ColumnDef<LaboratorioAbiertoReservaData>[];

  const columnas = filterByUser ? columnasBasicas : [...columnasBasicas, ...columnasGeneral];

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
    "Aprobado por",
    "Aprobar",
  ];
};
