import { Badge } from "@/components/ui/badge";
import { ReservaEstatus } from "@prisma/client";

export const BadgeEstatusReserva = ({ estatus }: { estatus: ReservaEstatus | "" }) => {
  return <Badge className={getStatusColor(estatus)}>{getStatusText(estatus)}</Badge>;
};

const getStatusColor = (status: ReservaEstatus | "") => {
  switch (status) {
    case ReservaEstatus.PENDIENTE:
      return "bg-yellow-500 text-yellow-900";
    case ReservaEstatus.FINALIZADA:
      return "bg-green-500 text-green-900";
    case ReservaEstatus.CANCELADA:
      return "bg-orange-500 text-orange-900";
    case ReservaEstatus.RECHAZADA:
      return "bg-red-500 text-red-900";
    default:
      return "bg-gray-500 text-gray-900";
  }
};

const getStatusText = (status: ReservaEstatus | "") => {
  switch (status) {
    case ReservaEstatus.PENDIENTE:
      return "Pendiente";
    case ReservaEstatus.FINALIZADA:
      return "Aprobada";
    case ReservaEstatus.CANCELADA:
      return "Cancelada";
    case ReservaEstatus.RECHAZADA:
      return "Rechazada";
    default:
      return "Pendiente";
  }
};
