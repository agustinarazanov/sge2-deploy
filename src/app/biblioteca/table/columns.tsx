import { type RouterOutputs } from "@/trpc/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import EstadoLibro from "./estado-libro";

type LibroData = RouterOutputs["biblioteca"]["getAll"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LibroData>();

  return [
    colHelper.accessor("id", {
      header: "Biblioteca ID",
      cell: ({ getValue }) => {
        const id = getValue().toString().padStart(4, "0");
        return `#${id}`;
      },
    }),
    colHelper.accessor("inventario", {
      header: "Inventario",
    }),
    colHelper.accessor("titulo", {
      header: "Titulo",
    }),
    colHelper.accessor("autor", {
      header: "Autor",
    }),
    colHelper.accessor("anio", {
      header: "Año",
    }),
    colHelper.accessor("editorial", {
      header: "Editorial",
    }),
    colHelper.accessor("idioma", {
      header: "Idioma",
    }),
    colHelper.accessor("isbn", {
      header: "ISBN",
    }),
    colHelper.display({
      header: "Estado",
      cell: ({ row }) => {
        const { estado, id } = row.original;

        return <EstadoLibro estado={estado} libroId={id} />;
      },
    }),
    // colHelper.accessor("estado", {
    //   header: "Estado",
    //   cell: ({ getValue }) => {

    //     return getValue();
    //   },
    // }),
  ] as ColumnDef<LibroData>[];
};
