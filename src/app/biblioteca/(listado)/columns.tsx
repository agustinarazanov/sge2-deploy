import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import EstadoLibro from "./estado-libro";

type LibroData = RouterOutputs["biblioteca"]["getAll"]["libros"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<LibroData>();

  return [
    colHelper.accessor("inventarioId", {
      header: "Inventario",
    }),
    colHelper.accessor("id", {
      header: "Biblioteca ID",
      cell: ({ getValue }) => {
        const id = getValue().toString().padStart(4, "0");
        return `#${id}`;
      },
    }),
    colHelper.accessor("titulo", {
      header: "Título",
    }),
    colHelper.accessor("autor.autorNombre", {
      header: "Autor",
    }),
    colHelper.accessor("anio", {
      header: "Año",
    }),
    colHelper.accessor("editorial.editorial", {
      header: "Editorial",
    }),
    colHelper.accessor("idioma.idioma", {
      header: "Idioma",
    }),
    colHelper.accessor("isbn", {
      header: "ISBN",
    }),
    colHelper.display({
      header: "Materias",
      cell: (info) => {
        const materiasLibro = info.row.original.materias;

        if (!materiasLibro.length) return <span className="hidden">Sin materias</span>;

        return <MateriasColumnar materiasLibro={materiasLibro.map((materia) => materia.materia.nombre)} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.accessor("disponible", {
      header: "Estado préstamo",
      cell: ({ row }) => {
        const { disponible, id } = row.original;

        return <EstadoLibro disponible={disponible} id={id} />;
      },
    }),
  ] as ColumnDef<LibroData>[];
};

export const getColumnsNames = () => {
  return ["Biblioteca ID", "Inventario", "Título", "Autor", "Año", "Editorial", "Idioma", "ISBN", "Estado"];
};

const MateriasColumnar = ({ materiasLibro }: { materiasLibro: string[] }) => {
  return (
    <ul className="flex list-disc flex-col">
      {materiasLibro.map((materia, index) => (
        <li key={index}>{materia}</li>
      ))}
    </ul>
  );
};
