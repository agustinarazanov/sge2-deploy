import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type ReservaPantallaData = RouterOutputs["reservas"]["pantalla"]["getReservaPorUser"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<ReservaPantallaData>();

  return [
    colHelper.accessor("docente", {
      header: "Docente",
    }),
    colHelper.accessor("materia", {
      header: "Materia",
    }),
    colHelper.accessor("laboratorio", {
      header: "Laboratorio",
    }),
    colHelper.accessor("horaInicio", {
      header: "Hora de inicio",
    }),
  ] as ColumnDef<ReservaPantallaData>[];
};

export const getColumnsNames = () => {
  return ["Docente", "Materia", "Laboratorio", "Hora de inicio"];
};
