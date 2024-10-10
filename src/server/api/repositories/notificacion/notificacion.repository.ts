import { ReservaEstatus, ReservaTipo, type PrismaClient } from "@prisma/client";

export type Notificacion = {
  id: number;
  tipo: ReservaTipo;
  fechaHoraInicio: Date;
  fechaHoraFin: Date;
};

export const getAllPendientesNotificaciones = async (
  ctx: { db: PrismaClient },
  userId: string,
): Promise<Notificacion[]> => {
  const reservasLaboratoriosPendientes = getReservasPendientesAprobacion(ctx, userId);
  const reservasEquipoCercanas = getReservasEquipoCercanas(ctx, userId);

  const notificaciones = await Promise.allSettled([reservasLaboratoriosPendientes, reservasEquipoCercanas]);

  // Si falla alguna de las peticiones, no queremos retornar errores porque no es critico
  const notificacionesFullfilled = notificaciones.filter((notificacion) => notificacion.status === "fulfilled");
  if (notificacionesFullfilled.length < 2) {
    console.error("No se pudieron obtener todas las notificaciones");
  }

  const valueNotificaciones = notificacionesFullfilled.flatMap((notificacion) => notificacion.value);

  return valueNotificaciones;
};

export const getReservasPendientesAprobacion = async (
  ctx: { db: PrismaClient },
  userId: string,
): Promise<Notificacion[]> => {
  const puedeAprobarCerrado = true; // TODO @Alex: Hacer peticion por permiso
  const puedeAprobarAbierto = true; // TODO @Alex: Hacer peticion por permiso

  if (!puedeAprobarCerrado && !puedeAprobarAbierto) {
    return [];
  }

  const reservaTipo: ReservaTipo[] = [
    puedeAprobarCerrado && ReservaTipo.LABORATORIO_CERRADO,
    puedeAprobarAbierto && ReservaTipo.LABORATORIO_ABIERTO,
  ].filter((tipo) => tipo !== undefined);

  const reservasPendientesDeAprobacion = await ctx.db.reserva.findMany({
    where: {
      tipo: {
        in: reservaTipo,
      },
      estatus: ReservaEstatus.PENDIENTE,
      fechaHoraInicio: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      fechaHoraInicio: true,
      fechaHoraFin: true,
      tipo: true,
    },
    orderBy: {
      fechaHoraInicio: "desc",
    },
  });

  return reservasPendientesDeAprobacion;
};

export const getReservasEquipoCercanas = async (ctx: { db: PrismaClient }, userId: string): Promise<Notificacion[]> => {
  const diasABuscar = 1;
  const fechaABuscar = new Date();
  fechaABuscar.setDate(fechaABuscar.getDate() + diasABuscar);

  const reservasCreadasProximasVencer = await ctx.db.reserva.findMany({
    where: {
      tipo: {
        in: [ReservaTipo.INVENTARIO, ReservaTipo.LIBRO],
      },
      estatus: ReservaEstatus.PENDIENTE,
      usuarioSolicitoId: userId,
      fechaHoraFin: {
        lte: fechaABuscar,
      },
    },
    select: {
      id: true,
      fechaHoraInicio: true,
      fechaHoraFin: true,
      tipo: true,
    },
    orderBy: {
      fechaHoraInicio: "asc",
    },
  });

  return reservasCreadasProximasVencer;
};
