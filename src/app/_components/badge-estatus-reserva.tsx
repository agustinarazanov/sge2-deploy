import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";

type StatusReservaType =
  RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"]["reservas"][number]["reserva"]["estatus"];

export const BadgeEstatusReserva = ({ estatus }: { estatus: StatusReservaType | "" }) => {
  return <Badge className={getStatusColor(estatus)}>{estatus}</Badge>;
};

const getStatusColor = (status: StatusReservaType | "") => {
  switch (status) {
    case "PENDIENTE":
      return "bg-yellow-500 text-yellow-900";
    case "FINALIZADA":
      return "bg-green-500 text-green-900";
    case "CANCELADA":
      return "bg-red-500 text-red-900";
    default:
      return "bg-gray-500 text-gray-900";
  }
};
