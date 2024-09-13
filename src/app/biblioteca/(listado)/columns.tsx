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
      header: "Titulo",
    }),
    colHelper.accessor("autor.autorNombre", {
      header: "Autor",
    }),
    colHelper.accessor("anio", {
      header: "Año",
    }),
    colHelper.display({
      header: "Editorial",
      cell: (info) => {
        const editorial = info.row.original.editorial;
        return editorial.editorial ?? "";
      },
    }),
    colHelper.display({
      header: "Idioma",
      cell: (info) => {
        const idioma = info.row.original.idioma;
        return idioma.idioma ?? "";
      },
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
  return ["Biblioteca ID", "Inventario", "Titulo", "Autor", "Año", "Editorial", "Idioma", "ISBN", "Estado"];
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
