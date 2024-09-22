import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getDateISOString } from "@/shared/get-date";
import DevolverEquipoModal from "../_components/modal-devolver";
import RenovarPrestamoEquipoModal from "../_components/modal-renovar";

type EquiposPrestamoData = RouterOutputs["reservas"]["reservaEquipo"]["getAll"]["reservas"][number];

export const getColumnasPrestamo = ({ filterByUser }: { filterByUser?: boolean }) => {
  const colHelper = createColumnHelper<EquiposPrestamoData>();

  const columnasBasicas = [
    colHelper.accessor("id", {
      header: "Prestamo #",
    }),
    colHelper.accessor("equipo.inventarioId", {
      header: "Equipo Inventario",
    }),
    colHelper.accessor("equipo.tipoId", {
      header: "Tipo",
    }),
    colHelper.accessor("reserva.usuarioSolicito.apellido", {
      header: "Prestado A",
      cell: ({ row }) => {
        const { reserva } = row.original;
        const { usuarioSolicito } = reserva;

        return <DatoUsuarioReserva usuario={usuarioSolicito} />;
      },
    }),
    colHelper.accessor("reserva.fechaHoraInicio", {
      header: "Fecha del Prestamo",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getDateISOString(reserva.fechaHoraInicio);

        return fecha;
      },
    }),
    colHelper.accessor("reserva.fechaHoraFin", {
      header: "Fecha de Finalización",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getDateISOString(reserva.fechaHoraFin);

        return fecha;
      },
    }),
    colHelper.accessor("reserva.usuarioAprobador.apellido", {
      header: "Presto",
      cell: ({ row }) => {
        const { reserva } = row.original;
        const { usuarioAprobador } = reserva;

        return <DatoUsuarioReserva usuario={usuarioAprobador} />;
      },
    }),
    colHelper.accessor("reserva.usuarioRenovo.apellido", {
      header: "Renovo",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const { usuarioRenovo } = reserva;

        if (!usuarioRenovo) {
          return <span className="text-center">-</span>;
        }

        const fechaRenovacion = reserva.fechaRenovacion ? getDateISOString(reserva.fechaRenovacion) : "";

        return (
          <div className="flex flex-col space-y-2 text-center">
            <DatoUsuarioReserva usuario={usuarioRenovo} />
            <div>{fechaRenovacion}</div>
          </div>
        );
      },
    }),
  ] as ColumnDef<EquiposPrestamoData>[];

  const columnasGeneral = [
    colHelper.display({
      header: "Renovar",
      cell: ({ row }) => {
        const { reserva, equipoId } = row.original;
        const { estatus } = reserva;

        if (estatus === "FINALIZADA") {
          return <span className="text-center">-</span>;
        }

        if (estatus === "PENDIENTE") {
          return <RenovarPrestamoEquipoModal equipoId={equipoId} />;
        }

        return <span className="text-center">Sin información</span>;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.accessor("reserva.usuarioRecibio.apellido", {
      header: "Recibio",
      cell: ({ row }) => {
        const { reserva, equipoId } = row.original;
        const { usuarioRecibio, estatus } = reserva;

        if (estatus === "FINALIZADA") {
          if (!usuarioRecibio) {
            return <span className="text-center">No</span>;
          }

          const fechaRecibido = reserva.fechaRecibido ? getDateISOString(reserva.fechaRecibido) : "";

          return (
            <div className="flex flex-col space-y-2 text-center">
              <DatoUsuarioReserva usuario={usuarioRecibio} />
              <div>{fechaRecibido}</div>
            </div>
          );
        }

        if (estatus === "PENDIENTE") {
          return <DevolverEquipoModal equipoId={equipoId} />;
        }

        return <span className="text-center">Sin información</span>;
      },
    }),
  ] as ColumnDef<EquiposPrestamoData>[];

  const columnas = filterByUser ? columnasBasicas : [...columnasBasicas, ...columnasGeneral];

  return columnas;
};

export const getColumnasPrestamoNames = () => {
  return [
    "Prestamo #",
    "Equipo Inventario",
    "Tipo",
    "Prestado A",
    "Fecha del Prestamo",
    "Fecha de Finalización",
    "Presto",
    "Renovo",
    "Renovar",
    "Devolver",
    "Recibio",
  ];
};
