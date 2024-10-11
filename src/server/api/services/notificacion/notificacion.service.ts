import { ReservaTipo } from "@prisma/client";
import {
  getAllPendientesNotificaciones,
  type Notificacion,
} from "../../repositories/notificacion/notificacion.repository";
import { protectedProcedure } from "../../trpc";
import { BIBLIOTECA_ROUTE, EQUIPOS_ROUTE, LABORATORIO_ABIERTO_ROUTE, LABORATORIO_ROUTE } from "@/shared/server-routes";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";

const RUTA_APROBAR_LABO_CERRADO = `${LABORATORIO_ROUTE.href}/solicitudes`;
const RUTA_APROBAR_LABO_ABIERTO = `${LABORATORIO_ABIERTO_ROUTE.href}/solicitudes`;
const RUTA_VER_RESERVA_LIBRO = `${BIBLIOTECA_ROUTE.href}/mis_prestamos`;
const RUTA_VER_RESERVA_EQUIPO = `${EQUIPOS_ROUTE.href}/mis_prestamos`;

type NotificacionUsuario = Notificacion & {
  link?: string;
  titulo: string;
  descripcion: string;
};

export const getAllPendientesNotificacionesProcedure = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id;

  const notificaciones = await getAllPendientesNotificaciones(ctx, userId);

  const notificacionesParaFrontend = notificaciones.map(buildNotificacion);

  return notificacionesParaFrontend;
});

const buildNotificacion = (notificacion: Notificacion) => {
  if (notificacion.tipo === ReservaTipo.LABORATORIO_CERRADO || notificacion.tipo === ReservaTipo.LABORATORIO_ABIERTO) {
    return buildNotificacionReservaLaboratorio(notificacion);
  }

  if (notificacion.tipo === ReservaTipo.INVENTARIO || notificacion.tipo === ReservaTipo.LIBRO) {
    return buildNotificacionReservaEquipo(notificacion);
  }

  throw new Error("Tipo de notificacion no reconocido");
};

const buildNotificacionReservaLaboratorio = (notificacion: Notificacion): NotificacionUsuario => {
  const esTipoAbierto = notificacion.tipo === ReservaTipo.LABORATORIO_ABIERTO;
  const esTipoCerrado = notificacion.tipo === ReservaTipo.LABORATORIO_CERRADO;

  if (esTipoAbierto) {
    return {
      ...notificacion,
      link: `${RUTA_APROBAR_LABO_ABIERTO}/${notificacion.id}`,
      titulo: "Laboratorio Abierto",
      descripcion: `Reserva pendiente de aprobación el ${getDateISOString(notificacion.fechaHoraInicio)} de ${getTimeISOString(notificacion.fechaHoraInicio)} a ${getTimeISOString(notificacion.fechaHoraFin)}.`,
    };
  }

  if (esTipoCerrado) {
    return {
      ...notificacion,
      link: `${RUTA_APROBAR_LABO_CERRADO}/${notificacion.id}`,
      titulo: "Laboratorio",
      descripcion: `Reserva pendiente de aprobación el ${getDateISOString(notificacion.fechaHoraInicio)} de ${getTimeISOString(notificacion.fechaHoraInicio)} a ${getTimeISOString(notificacion.fechaHoraFin)}.`,
    };
  }

  throw new Error("Tipo de notificacion no reconocido");
};

const buildNotificacionReservaEquipo = (notificacion: Notificacion): NotificacionUsuario => {
  const esTipoInventario = notificacion.tipo === ReservaTipo.INVENTARIO;
  const esTipoLibro = notificacion.tipo === ReservaTipo.LIBRO;

  if (esTipoInventario) {
    return {
      ...notificacion,
      link: `${RUTA_VER_RESERVA_EQUIPO}`,
      titulo: "Reserva de equipo",
      descripcion: `Reserva pronta a finalizar el ${getDateISOString(notificacion.fechaHoraFin)}.`,
    };
  }

  if (esTipoLibro) {
    return {
      ...notificacion,
      link: `${RUTA_VER_RESERVA_LIBRO}`,
      titulo: "Reserva de libro",
      descripcion: `Reserva pronta a finalizar el ${getDateISOString(notificacion.fechaHoraFin)}.`,
    };
  }

  throw new Error("Tipo de notificacion no reconocido");
};
