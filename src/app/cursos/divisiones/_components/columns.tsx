import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type DivisionesData = RouterOutputs["division"]["getAll"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<DivisionesData>();

  return [
    colHelper.accessor("nombre", {
      header: "Nombre de División",
    }),
    colHelper.accessor("anio", {
      header: "Año",
    }),
  ] as ColumnDef<DivisionesData>[];
};

export const getColumnsNames = () => {
  return ["Nombre de División", "Año"];
};
