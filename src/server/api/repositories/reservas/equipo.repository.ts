import { type Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import {
  type inputGetReservasEquiposPorEquipoId,
  type inputPrestarEquipo,
  type inputGetReservaEquipoPorUsuarioId,
  type inputGetAllPrestamosEquipos,
} from "@/shared/filters/reservas-equipos-filter.schema";
import { getDateISO } from "@/shared/get-date";
import { informacionUsuario } from "../usuario-helper";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";

type InputGetAll = z.infer<typeof inputGetAllPrestamosEquipos>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAll, userId: string) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy, estatus, filtrByUserId } = input;

  const filtrosWhereReservaEquipo: Prisma.ReservaEquipoWhereInput = {
    reserva: {
      ...(filtrByUserId === "true" ? { usuarioSolicitoId: userId } : {}),
      ...(estatus ? { estatus: estatus } : {}),
    },
    ...(searchText
      ? {
          OR: [
            {
              reserva: {
                reservaEquipo: {
                  equipo: {
                    tipo: {
                      nombre: {
                        contains: searchText ?? undefined,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
            {
              reserva: {
                reservaEquipo: {
                  equipo: {
                    inventarioId: {
                      contains: searchText ?? undefined,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const ordenEquipo: Prisma.ReservaEquipoOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  const [count, reservas] = await ctx.db.$transaction([
    ctx.db.reservaEquipo.count({
      where: filtrosWhereReservaEquipo,
    }),
    ctx.db.reservaEquipo.findMany({
      include: {
        reserva: {
          include: {
            usuarioSolicito: {
              select: informacionUsuario,
            },
            usuarioAprobador: {
              select: informacionUsuario,
            },
            usuarioRenovo: {
              select: informacionUsuario,
            },
            usuarioRecibio: {
              select: informacionUsuario,
            },
          },
        },
        equipo: true,
      },
      where: filtrosWhereReservaEquipo,
      orderBy: ordenEquipo,
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    reservas,
  };
};

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaEquipoPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;
  const reservas = await ctx.db.reservaEquipo.findMany({
    include: {
      reserva: true,
      equipo: {
        include: {
          marca: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
    where: {
      reserva: {
        usuarioCreadorId: id,
      },
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });
  return reservas;
};

type InputCrearPrestamoEquipo = z.infer<typeof inputPrestarEquipo>;
export const crearPrestamoEquipo = async (
  ctx: { db: PrismaClient },
  input: InputCrearPrestamoEquipo,
  userId: string,
) => {
  try {
    if (!input.usuarioSolicitanteId) {
      throw new Error("El usuario solicitante es requerido");
    }

    const reserva = await ctx.db.$transaction(async (tx) => {
      const disponibilidad = await tx.equipo.findUnique({
        where: {
          id: input.equipoId,
        },
        select: {
          disponible: true,
        },
      });

      if (!disponibilidad) {
        throw new Error("El equipo no existe");
      }

      if (!disponibilidad.disponible) {
        throw new Error("El equipo ya está reservado");
      }

      const reserva = await tx.reserva.create({
        data: {
          reservaEquipo: {
            create: {
              fechaEntregado: getDateISO(input.fechaInicio),
              equipoId: input.equipoId,
              usuarioCreadorId: userId,
              usuarioModificadorId: userId,
            },
          },

          estatus: "PENDIENTE",
          fechaHoraInicio: getDateISO(input.fechaInicio),
          fechaHoraFin: getDateISO(input.fechaFin),
          tipo: "INVENTARIO",

          usuarioSolicitoId: input.usuarioSolicitanteId!,
          usuarioAprobadorId: userId,
          usuarioRechazadoId: null,
          usuarioTutorId: null,
          usuarioRenovoId: null,

          fechaAprobacion: new Date(),
          fechaRechazo: null,
          fechaRenovacion: null,

          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
        },
      });

      await tx.equipo.update({
        where: {
          id: input.equipoId,
        },
        data: {
          disponible: false,
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva ${input.equipoId}`);
  }
};

type InputGetReservas = z.infer<typeof inputGetReservasEquiposPorEquipoId>;
export const verReservasDeEquipo = async (ctx: { db: PrismaClient }, input: InputGetReservas) => {
  try {
    const reservas = await ctx.db.reserva.findMany({
      where: {
        tipo: "INVENTARIO",
        reservaEquipo: {
          equipoId: input.equipoId,
        },
      },
      include: {
        usuarioSolicito: {
          select: informacionUsuario,
        },
        usuarioAprobador: {
          select: informacionUsuario,
        },
        usuarioRecibio: {
          select: informacionUsuario,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return reservas;
  } catch (error) {
    throw new Error(`Error obteniendo reservas ${input.equipoId}`);
  }
};

export const devolverEquipo = async (ctx: { db: PrismaClient }, input: InputGetReservas, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const equipo = await tx.equipo.findUnique({
        where: {
          id: input.equipoId,
        },
        select: {
          id: true,
          disponible: true,
        },
      });

      if (!equipo) {
        throw new Error("El equipo no existe");
      }

      if (equipo.disponible) {
        throw new Error("El equipo ya está disponible");
      }

      await tx.equipo.update({
        where: {
          id: input.equipoId,
        },
        data: {
          disponible: true,
        },
      });

      const reservas = await tx.reserva.findMany({
        where: {
          tipo: "INVENTARIO",
          reservaEquipo: {
            equipoId: input.equipoId,
          },
          estatus: "PENDIENTE",
        },
      });

      if (reservas.length === 0) {
        throw new Error("No hay reservas para devolver");
      }

      const reserva = reservas[0];
      if (!reserva) {
        throw new Error("No se pudo encontrar la reserva");
      }

      await tx.reserva.update({
        where: {
          id: reserva.id,
        },
        data: {
          usuarioRecibioId: userId,
          estatus: "FINALIZADA",

          fechaRecibido: new Date(),
        },
      });
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error devolviendo equipo`);
  }
};

type InputRenovarPrestamoEquipo = z.infer<typeof inputPrestarEquipo>;
export const renovarEquipo = async (ctx: { db: PrismaClient }, input: InputRenovarPrestamoEquipo, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const equipo = await tx.equipo.findUnique({
        where: {
          id: input.equipoId,
        },
        select: {
          id: true,
          disponible: true,
        },
      });

      if (!equipo) {
        throw new Error("El equipo no existe");
      }

      // Si ya esta disponible, no se puede renovar
      if (equipo.disponible) {
        throw new Error("El equipo ya está disponible");
      }

      const reservas = await tx.reserva.findMany({
        where: {
          tipo: "INVENTARIO",
          reservaEquipo: {
            equipoId: input.equipoId,
          },
          estatus: "PENDIENTE",
        },
      });

      if (reservas.length === 0) {
        throw new Error("No hay reservas para renovar");
      }

      const reserva = reservas[0];
      if (!reserva) {
        throw new Error("No se pudo encontrar la reserva");
      }

      await tx.reserva.update({
        where: {
          id: reserva.id,
        },
        data: {
          usuarioRenovoId: userId,
          estatus: "PENDIENTE", // Se mantiene el estatus original

          fechaHoraInicio: getDateISO(input.fechaInicio),
          fechaHoraFin: getDateISO(input.fechaFin),

          fechaRenovacion: new Date(),
        },
      });
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error renovando equipo`);
  }
};
