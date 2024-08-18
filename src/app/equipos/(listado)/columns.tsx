import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
// import EstadoEquipo from "./estado-equipo";

type EquipoData = RouterOutputs["equipos"]["getAll"]["equipos"][number];

export const getEquiposColumnas = () => {
  const colHelper = createColumnHelper<EquipoData>();

  return [
    colHelper.accessor("inventarioId", {
      header: "Inventario",
      cell: ({ getValue }) => {
        const id = getValue().toString().padStart(4, "0");
        return `#${id}`;
      },
    }),
    colHelper.accessor("tipo.nombre", {
      header: "Tipo",
    }),
    colHelper.accessor("marca.nombre", {
      header: "Marca",
    }),
    colHelper.accessor("modelo", {
      header: "Modelo",
    }),
    colHelper.accessor("numeroSerie", {
      header: "Número de serie",
    }),
    colHelper.display({
      header: "Estado",
      cell: (info) => {
        const estado = info.row.original.estado;
        return estado.nombre ?? "";
      },
    }),
    // colHelper.accessor("disponible", {
    //   header: "Estado prestamo",
    //   cell: ({ row }) => {
    //     const { disponible, id } = row.original;

    //     return <EstadoEquipo estado={disponible} equipoId={id} />;
    //   },
    // }),
  ] as ColumnDef<EquipoData>[];
};

export const getColumnsNames = () => {
  return ["Inventario", "Tipo", "Marca", "Modelo", "Número de serie", "Estado", "Estado prestamo"];
};
