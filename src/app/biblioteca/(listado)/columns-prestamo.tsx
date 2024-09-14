import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getDateISOString } from "@/shared/get-date";
import DevolverLibroModal from "../_components/modal-devolver";
import RenovarPrestamoLibroModal from "../_components/modal-renovar";

type LibroPrestamoData = RouterOutputs["reservas"]["reservaBiblioteca"]["getAll"]["reservas"][number];

export const getColumnasPrestamo = () => {
  const colHelper = createColumnHelper<LibroPrestamoData>();

  return [
    colHelper.accessor("id", {
      header: "Prestamo #",
    }),
    colHelper.accessor("libro.inventarioId", {
      header: "Libro Inventario ID",
    }),
    colHelper.accessor("libro.titulo", {
      header: "Título",
    }),
    colHelper.accessor("reserva.usuarioSolicito.apellido", {
      header: "Prestado a",
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
    colHelper.display({
      header: "Renovar",
      cell: ({ row }) => {
        const { reserva, libroId } = row.original;
        const { estatus } = reserva;

        if (estatus === "FINALIZADA") {
          return <span className="text-center">-</span>;
        }

        if (estatus === "PENDIENTE") {
          return <RenovarPrestamoLibroModal libroId={libroId} />;
        }

        return <span className="text-center">Sin información</span>;
      },
    }),
    colHelper.accessor("reserva.usuarioRecibio.apellido", {
      header: "Recibio",
      cell: ({ row }) => {
        const { reserva, libroId } = row.original;
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
          return <DevolverLibroModal libroId={libroId} />;
        }

        return <span className="text-center">Sin información</span>;
      },
    }),
  ] as ColumnDef<LibroPrestamoData>[];
};

export const getColumnasPrestamoNames = () => {
  return [
    "Prestamo #",
    "Libro",
    "Título",
    "Prestado A",
    "Fecha del Prestamo",
    "Fecha de Finalización",
    "Presto",
    "Renovo",
    "Renovar",
    "Recibio",
  ];
};