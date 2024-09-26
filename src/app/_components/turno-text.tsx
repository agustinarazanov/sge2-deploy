import { type RouterOutputs } from "@/trpc/react";

type TurnoType = RouterOutputs["cursos"]["getAll"]["cursos"][number]["turno"];

export const CursoTurno = ({ turno }: { turno?: TurnoType }) => {
  if (turno === "MANANA") return "Mañana";
  if (turno === "TARDE") return "Tarde";
  if (turno === "NOCHE") return "Noche";

  return turno ?? "-";
};

export const turnosValues = [
  { id: "MANANA", label: "Mañana" },
  { id: "TARDE", label: "Tarde" },
  { id: "NOCHE", label: "Noche" },
];
