import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type TipoData = RouterOutputs["equipos"]["getAllTipos"]["tipos"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<TipoData>();

  return [
    colHelper.accessor("nombre", {
      header: "Nombre",
    }),
    colHelper.accessor("fechaCreacion", {
      header: "Fecha creación",
      cell: ({ getValue }) => {
        const id = getValue();
        return new Date(id).toLocaleDateString("es-ES");
      },
    }),
    colHelper.display({
      header: "Cantidad de equipos",
      cell: (info) => {
        const equipos = info.row.original.equipos;
        return equipos.length;
      },
    }),
  ] as ColumnDef<TipoData>[];
};

export const equiposColumnas = ["Nombre", "Fecha creación", "Usuario creador", "Cantidad de equipos"];
