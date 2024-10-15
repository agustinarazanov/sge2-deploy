import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type MateriaData = RouterOutputs["materia"]["getAll"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<MateriaData>();

  return [
    colHelper.accessor("codigo", {
      header: "Código",
    }),
    colHelper.accessor("anio", {
      header: "Año",
    }),
    colHelper.accessor("nombre", {
      header: "Materia",
    }),
    colHelper.accessor("duracion", {
      header: "Duración",
      cell: ({ getValue }) => {
        const duracion = getValue();
        return duracion === "ANUAL" ? "Anual" : duracion === "CUATRIMESTRAL" ? "Cuatrimestral" : "Ambos";
      },
    }),
    colHelper.accessor("tipo", {
      header: "Tipo",
      cell: ({ getValue }) => {
        const tipo = getValue();
        return tipo === "INTEGRADORA" ? "Integradora" : tipo === "OBLIGATORIA" ? "Obligatoria" : "Electiva";
      },
    }),
  ] as ColumnDef<MateriaData>[];
};

export const getColumnsNames = () => {
  return ["Código", "Año", "Materia", "Duración", "Tipo"];
};
