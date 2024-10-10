import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type LaboratorioData = RouterOutputs["admin"]["laboratorios"]["getAll"]["laboratorios"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LaboratorioData>();

  return [
    colHelper.accessor("nombre", {
      header: "Nombre",
    }),
    colHelper.accessor("tienePc", {
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
    colHelper.accessor("esReservable", {
      header: "Es reservable",
      cell: (info) => {
        const esReservable = info.row.original.esReservable;

        const color = esReservable ? "success" : "danger";
        const texto = esReservable ? "Sí" : "No";

        return (
          <Badge variant={"default"} color={color}>
            {texto}
          </Badge>
        );
      },
    }),
    colHelper.accessor("laboratorioAbiertoTipo", {
      header: "Tipo de laboratorio",
      cell: (info) => {
        const tipoLaboratorio = info.row.original.laboratorioAbiertoTipo;

        return tipoLaboratorio ?? "Normal";
      },
    }),
    colHelper.accessor("sede.nombre", {
      header: "Sede",
    }),
    colHelper.display({
      header: "Cantidad de armarios",
      cell: (info) => {
        const armarios = info.row.original.armarios;

        return armarios.length;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
  ] as ColumnDef<LaboratorioData>[];
};

export const adminLaboratoriosColumnas = [
  "Nombre",
  "Tiene PC",
  "Es abierto",
  "Tipo de laboratorio",
  "Sede",
  "Cantidad de armarios",
];
