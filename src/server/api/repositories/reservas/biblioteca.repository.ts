import { type Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import {
  type inputGetReservasLibroPorLibroId,
  type inputPrestarLibro,
  type inputGetReservaLibroPorUsuarioId,
  type inputGetAllPrestamosLibros,
} from "@/shared/filters/reservas-filter.schema";
import { getDateISO } from "@/shared/get-date";
import { informacionUsuario } from "../usuario-helper";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";

type InputGetAll = z.infer<typeof inputGetAllPrestamosLibros>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAll, userId: string) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy, estatus, filtrByUserId } = input;

  const filtrosWhereReservaLibro: Prisma.ReservaLibroWhereInput = {
    reserva: {
      ...(filtrByUserId === "true" ? { usuarioSolicitoId: userId } : {}),
      ...(estatus ? { estatus: estatus } : {}),
    },
    ...(searchText
      ? {
          OR: [
            {
              reserva: {
                reservaLibro: {
                  libro: {
                    titulo: {
                      contains: searchText ?? undefined,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
            {
              reserva: {
                reservaLibro: {
                  libro: {
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

  console.log({
    input,
    filtrosWhereReservaLibro,
  });

  const ordenLibro: Prisma.ReservaLibroOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  console.log({ filtrosWhereReservaLibro, userId });

  const [count, reservas] = await ctx.db.$transaction([
    ctx.db.reservaLibro.count({
      where: filtrosWhereReservaLibro,
    }),
    ctx.db.reservaLibro.findMany({
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
        libro: true,
      },
      where: filtrosWhereReservaLibro,
      orderBy: ordenLibro,
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    reservas,
  };
};

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaLibroPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;
  const reservas = await ctx.db.reservaLibro.findMany({
    include: {
      reserva: true,
      libro: true,
    },
    where: {
      reserva: {
        usuarioSolicitoId: id,
      },
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });
  return reservas;
};

type InputCrearPrestamoLibro = z.infer<typeof inputPrestarLibro>;
export const crearPrestamoLibro = async (ctx: { db: PrismaClient }, input: InputCrearPrestamoLibro, userId: string) => {
  try {
    if (!input.usuarioSolicitanteId) {
      throw new Error("El usuario solicitante es requerido");
    }

    const reserva = await ctx.db.$transaction(async (tx) => {
      const disponibilidad = await tx.libro.findUnique({
        where: {
          id: input.libroId,
        },
        select: {
          disponible: true,
        },
      });

      if (!disponibilidad) {
        throw new Error("El libro no existe");
      }

      if (!disponibilidad.disponible) {
        throw new Error("El libro ya está reservado");
      }

      const reserva = await tx.reserva.create({
        data: {
          reservaLibro: {
            create: {
              fechaEntregado: getDateISO(input.fechaInicio),
              libroId: input.libroId,

              usuarioCreadorId: userId,
              usuarioModificadorId: userId,
            },
          },

          estatus: "PENDIENTE",
          fechaHoraInicio: getDateISO(input.fechaInicio),
          fechaHoraFin: getDateISO(input.fechaFin),
          tipo: "LIBRO",

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

      await tx.libro.update({
        where: {
          id: input.libroId,
        },
        data: {
          disponible: false,
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva ${input.libroId}`);
  }
};

type InputGetReservas = z.infer<typeof inputGetReservasLibroPorLibroId>;
export const verReservasDeLibro = async (ctx: { db: PrismaClient }, input: InputGetReservas) => {
  try {
    const reservas = await ctx.db.reserva.findMany({
      where: {
        tipo: "LIBRO",
        reservaLibro: {
          libroId: input.libroId,
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
    throw new Error(`Error obteniendo reservas ${input.libroId}`);
  }
};

export const devolverLibro = async (ctx: { db: PrismaClient }, input: InputGetReservas, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const libro = await tx.libro.findUnique({
        where: {
          id: input.libroId,
        },
        select: {
          id: true,
          disponible: true,
        },
      });

      if (!libro) {
        throw new Error("El libro no existe");
      }

      if (libro.disponible) {
        throw new Error("El libro ya está disponible");
      }

      await tx.libro.update({
        where: {
          id: input.libroId,
        },
        data: {
          disponible: true,
        },
      });

      const reservas = await tx.reserva.findMany({
        where: {
          tipo: "LIBRO",
          reservaLibro: {
            libroId: input.libroId,
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
    throw new Error(`Error devolviendo libro`);
  }
};

type InputRenovarPrestamoLibro = z.infer<typeof inputPrestarLibro>;
export const renovarLibro = async (ctx: { db: PrismaClient }, input: InputRenovarPrestamoLibro, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const libro = await tx.libro.findUnique({
        where: {
          id: input.libroId,
        },
        select: {
          id: true,
          disponible: true,
        },
      });

      if (!libro) {
        throw new Error("El libro no existe");
      }

      // Si ya esta disponible, no se puede renovar
      if (libro.disponible) {
        throw new Error("El libro ya está disponible");
      }

      const reservas = await tx.reserva.findMany({
        where: {
          tipo: "LIBRO",
          reservaLibro: {
            libroId: input.libroId,
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
    throw new Error(`Error renovando libro`);
  }
};
