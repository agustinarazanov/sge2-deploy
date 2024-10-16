/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { CursoTurno } from "@/app/_components/turno-text";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type CursosData = RouterOutputs["cursos"]["getAll"]["cursos"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<CursosData>();

  return [
    colHelper.accessor("anioDeCarrera", {
      header: "Año",
    }),
    colHelper.accessor("materia.nombre", {
      header: "Materia",
    }),
    colHelper.accessor("sede.nombre", {
      header: "Sede",
    }),
    colHelper.accessor("ac", {
      header: "Duración",
      cell: (info) => {
        const duracion = info.row.original.ac;

        if (duracion === "A") return "Anual";
        if (duracion === "C") return "Cuatrimestral";
        return "-";
      },
    }),
    colHelper.accessor("turno", {
      header: "Turno",
      cell: (info) => {
        const turno = info.row.original.turno;

        return <CursoTurno turno={turno} />;
      },
    }),
    colHelper.accessor("division.nombre", {
      header: "División",
    }),
    colHelper.display({
      header: "Lunes",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"LUNES"} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Martes",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"MARTES"} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Miércoles",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"MIERCOLES"} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Jueves",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"JUEVES"} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Viernes",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"VIERNES"} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Sábado",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"SABADO"} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.display({
      header: "Profesor",
      cell: (info) => {
        return <DatoUsuarioReserva usuario={info.row.original.profesor} />;
      },
    }),
    colHelper.display({
      header: "Ayudante/s",
      cell: (info) => {
        const ayudantes = info.row.original.ayudantes;

        if (!ayudantes.length) return <span className="hidden">Sin ayudantes</span>;

        return ayudantes.map((ayudante) => <DatoUsuarioReserva usuario={ayudante.usuario} key={ayudante.userId} />);
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
  ] as ColumnDef<CursosData>[];
};

export const getColumnsNames = () => {
  return [
    "Año",
    "Materia",
    "Sede",
    "Duración",
    "Turno",
    "Division",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Profesor",
    "Ayudante/s",
  ];
};

type HoraDiaProps = {
  dia1: string;
  dia2?: string | null;
  horaInicio1: string | number;
  horaInicio2?: string | number | null;
  duracion1: string | number;
  duracion2?: string | number | null;
  diaDeHoy: string;
};
const HoraDia = ({ dia1, dia2, horaInicio1, horaInicio2, duracion1, duracion2, diaDeHoy }: HoraDiaProps) => {
  horaInicio1 = Number(horaInicio1);
  horaInicio2 = Number(horaInicio2);
  duracion1 = Number(duracion1);
  duracion2 = Number(duracion2);

  const horas = [0, 1, 2, 3, 4, 5, 6];

  const esHoyDia1 = dia1 === diaDeHoy;
  const esHoyDia2 = dia2 === diaDeHoy;

  const finClase1 = esHoyDia1 ? horaInicio1 + duracion1 : 0;
  const finClase2 = esHoyDia2 ? horaInicio2 + duracion2 : 0;

  return (
    <div className="flex flex-row space-x-0">
      {horas.map((hora) => {
        if (esHoyDia1 && hora >= horaInicio1 && hora < finClase1) {
          return (
            <div
              key={`hora1-${hora}`}
              className="flex h-5 w-5 justify-center rounded-full bg-primary dark:bg-[hsl(280,100%,50%)]"
            >
              {hora}
            </div>
          );
        }

        if (esHoyDia2 && hora >= horaInicio2 && hora < finClase2) {
          return (
            <div
              key={`hora2-${hora}`}
              className="flex h-5 w-5 justify-center rounded-full bg-primary dark:bg-[hsl(280,100%,50%)]"
            >
              {hora}
            </div>
          );
        }

        return (
          <div
            key={`hora-${hora}`}
            className="flex h-5 w-5 justify-center rounded-full bg-slate-300 align-top dark:bg-gray-400"
          >
            {hora}
          </div>
        );
      })}
    </div>
  );
};
