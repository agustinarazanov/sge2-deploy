import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type CursosData = RouterOutputs["cursos"]["getAll"]["cursos"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<CursosData>();

  return [
    colHelper.accessor("division.nombre", {
      header: "División",
    }),
    colHelper.display({
      header: "Duración",
      cell: (info) => {
        const duracion = info.row.original.ac;

        if (duracion === "A") return "Anual";
        if (duracion === "C") return "Cuatrimestral";
        return "-";
      },
    }),
    colHelper.display({
      header: "Turno",
      cell: (info) => {
        const turno = info.row.original.turno;

        if (turno === "MANANA") return "Mañana";
        if (turno === "TARDE") return "Tarde";
        if (turno === "NOCHE") return "Noche";

        return turno ?? "-";
      },
    }),
    colHelper.accessor("sede.nombre", {
      header: "Sede",
    }),
    colHelper.display({
      header: "Lunes",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"LUNES"} />;
      },
    }),
    colHelper.display({
      header: "Martes",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"MARTES"} />;
      },
    }),
    colHelper.display({
      header: "Miércoles",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"MIERCOLES"} />;
      },
    }),
    colHelper.display({
      header: "Jueves",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"JUEVES"} />;
      },
    }),
    colHelper.display({
      header: "Viernes",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"VIERNES"} />;
      },
    }),
    colHelper.display({
      header: "Sábado",
      cell: (info) => {
        return <HoraDia {...info.row.original} diaDeHoy={"SABADO"} />;
      },
    }),
    colHelper.display({
      header: "Profesor",
      cell: (info) => {
        const profesorUser = info.row.original.profesorUser;
        return `${profesorUser.apellido} ${profesorUser.name}`;
      },
    }),
    colHelper.display({
      header: "Ayudante/s",
      cell: (info) => {
        const ayudanteUser = info.row.original.ayudanteUser;
        return `${ayudanteUser.apellido} ${ayudanteUser.name}`;
      },
    }),
  ] as ColumnDef<CursosData>[];
};

export const getColumnsNames = () => {
  return [
    "Division",
    "Duración",
    "Turno",
    "Sede",
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
  dia2: string;
  horaInicio1: string | number;
  horaInicio2: string | number;
  duracion1: string | number;
  duracion2: string | number;
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

  return (
    <div className="flex flex-row space-x-0">
      {horas.map((hora) => {
        if (esHoyDia1 && horaInicio1 >= hora && horaInicio1 < hora + duracion1) {
          return (
            <div key={hora} className="flex h-4 w-4 justify-center rounded-full bg-primary">
              {hora}
            </div>
          );
        }

        if (esHoyDia2 && horaInicio2 >= hora && horaInicio2 < hora + duracion2) {
          return (
            <div key={hora} className="flex h-4 w-4 justify-center rounded-full bg-primary">
              {hora}
            </div>
          );
        }

        return (
          <div key={hora} className="flex h-4 w-4 justify-center rounded-full bg-gray-400">
            {hora}
          </div>
        );
      })}
    </div>
  );
};
