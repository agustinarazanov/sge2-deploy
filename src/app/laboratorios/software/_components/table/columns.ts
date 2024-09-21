import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type SoftwareData = RouterOutputs["software"]["getAll"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<SoftwareData>();

  return [
    colHelper.accessor("nombre", {
      header: "Programa",
    }),
    colHelper.accessor("version", {
      header: "Versión",
    }),
    colHelper.accessor("estado", {
      header: "Estado",
    }),
    colHelper.display({
      header: "Laboratorios",
      cell: (info) => {
        const autor = info.row.original.laboratorios;

        return autor.length;
      },
    }),
  ] as ColumnDef<SoftwareData>[];
};

export const getColumnsNames = () => {
  return ["Programa", "Versión", "Estado", "Laboratorios"];
};
