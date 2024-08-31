import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type LibroData = RouterOutputs["admin"]["laboratorios"]["getAll"]["laboratorios"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LibroData>();

  return [
    colHelper.accessor("nombre", {
      header: "Nombre",
    }),
    colHelper.display({
      header: "Tiene PC",
      cell: (info) => {
        const tienePc = info.row.original.tienePc;

        const color = tienePc ? "success" : "danger";
        const texto = tienePc ? "Sí" : "No";

        return (
          <Badge variant={"default"} color={color}>
            {texto}
          </Badge>
        );
      },
    }),
    colHelper.display({
      header: "Es abierto",
      cell: (info) => {
        const esAbierto = info.row.original.esAbierto;

        const color = esAbierto ? "success" : "danger";
        const texto = esAbierto ? "Sí" : "No";

        return (
          <Badge variant={"default"} color={color}>
            {texto}
          </Badge>
        );
      },
    }),
    colHelper.display({
      header: "Tipo de laboratorio",
      cell: (info) => {
        const tipoLaboratorio = info.row.original.laboratorioAbiertoTipo;

        return tipoLaboratorio ?? "Normal";
      },
    }),
    colHelper.accessor("nombre", {
      header: "Sede",
    }),
    colHelper.display({
      header: "Cantidad de armarios",
      // cell: (info) => {
      //   const armarios = info.row.original.armarios;

      //   return armarios.length;
      // },
    }),
  ] as ColumnDef<LibroData>[];
};

export const adminLaboratoriosColumnas = [
  "Nombre",
  "Tiene PC",
  "Es abierto",
  "Tipo de laboratorio",
  "Sede",
  "Cantidad de armarios",
];
