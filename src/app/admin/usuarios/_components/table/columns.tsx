import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";

type LibroData = RouterOutputs["admin"]["usuarios"]["getAll"]["usuarios"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LibroData>();

  return [
    colHelper.display({
      header: "Imagen",
      cell: (info) => {
        const imagen = info.row.original.image;

        return imagen ? (
          <Image src={imagen} alt="Imagen de perfil" width={32} height={32} className="rounded-full" />
        ) : null;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.accessor("email", {
      header: "Email",
    }),
    colHelper.accessor("legajo", {
      header: "Legajo",
    }),
    colHelper.accessor("apellido", {
      header: "Nombre",
      cell: (info) => {
        const usuario = info.row.original;

        if (!usuario.apellido || !usuario.nombre) {
          return null;
        }

        return `${usuario.apellido}, ${usuario.nombre}`;
      },
    }),
    colHelper.display({
      header: "Roles",
      cell: (info) => {
        const rolesUsuario = info.row.original.usuarioRol;

        return (
          <div className="flex flex-row space-x-2">
            {rolesUsuario.map((rol) => (
              <Badge key={rol.rolId} color="aqua" label={rol.rol.nombre} />
            ))}
          </div>
        );
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
  ] as ColumnDef<LibroData>[];
};

export const adminUsuariosColumnas = ["Imagen", "Email", "Legajo", "Nombre", "Roles"];
