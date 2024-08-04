import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type LibroData = RouterOutputs["admin"]["roles"]["getAll"]["roles"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LibroData>();

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
      header: "Cantidad de usuarios",
      cell: (info) => {
        const usuarios = info.row.original.usuarios;

        return usuarios.length;
      },
    }),
    colHelper.display({
      header: "Cantidad de permisos",
      cell: (info) => {
        const permisos = info.row.original.rolPermiso;

        return permisos.length;
      },
    }),
    colHelper.display({
      header: "Permisos",
      cell: (info) => {
        const rolesPermiso = info.row.original.rolPermiso;

        return rolesPermiso.map((rol) => rol.permiso.nombre).join(", ");
      },
    }),
  ] as ColumnDef<LibroData>[];
};

export const adminRolesColumnas = [
  "Nombre",
  "Fecha creación",
  "Cantidad de usuarios",
  "Cantidad de permisos",
  "Permisos",
];
