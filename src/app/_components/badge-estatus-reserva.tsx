import { Badge } from "@/components/ui/badge";
import { ReservaEstatus, ReservaTipo } from "@prisma/client";

export const BadgeEstatusReserva = ({ estatus }: { estatus: ReservaEstatus | "" }) => {
  return <Badge color={getStatusColor(estatus)}>{getStatusText(estatus)}</Badge>;
};

export const BadgeLaboratorioAbiertoReserva = ({ tipo }: { tipo: ReservaTipo | "" }) => {
  const esTipoAbierto = tipo === ReservaTipo.LABORATORIO_ABIERTO;

  if (esTipoAbierto) {
    return <Badge color="info">Laboratorio abierto</Badge>;
  }

  return null;
};

export const BadgeDiscrecionalReserva = ({ esDiscrecional }: { esDiscrecional: boolean }) => {
  if (esDiscrecional) {
    return <Badge color="info">Discrecional</Badge>;
  }

  return null;
};

const getStatusColor = (status: ReservaEstatus | "") => {
  switch (status) {
    case ReservaEstatus.PENDIENTE:
      return "aqua";
    case ReservaEstatus.FINALIZADA:
      return "success";
    case ReservaEstatus.CANCELADA:
      return "warning";
    case ReservaEstatus.RECHAZADA:
      return "danger";
    default:
      return "aqua";
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
