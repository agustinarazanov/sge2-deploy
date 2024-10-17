import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { esFechaPasada, getDateISOString, getTimeISOString } from "@/shared/get-date";
import { BadgeEstatusReserva } from "@/app/_components/badge-estatus-reserva";

type LaboratorioCerradoReservaData =
  RouterOutputs["reservas"]["reservarLaboratorioCerrado"]["getAll"]["reservas"][number];

export const getColumnasReservasLaboratorioCerrado = ({ filterByUser }: { filterByUser?: boolean }) => {
  const colHelper = createColumnHelper<LaboratorioCerradoReservaData>();

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
    colHelper.accessor("curso.division.nombre", {
      header: "Division",
      cell: ({ row }) => {
        return row.original?.curso?.division.nombre ?? "-";
      },
    }),
    colHelper.accessor("curso.materia.nombre", {
      header: "Materia",
      cell: ({ row }) => {
        // Puede ser reserva discrecional
        return row.original?.curso?.materia.nombre ?? "-";
      },
    }),
    colHelper.accessor("curso.sede.nombre", {
      header: "Sede",
      cell: ({ row }) => {
        return row.original.sede.nombre;
      },
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

        if (estatus === "PENDIENTE" && esFechaPasada(reserva.fechaHoraInicio)) {
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
  ] as ColumnDef<LaboratorioCerradoReservaData>[];

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
