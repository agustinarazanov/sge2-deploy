import type {
  inputAprobarReservaLaboratorioCerradoSchema,
  inputEditarReservaLaboratorioCerradoSchema,
  inputGetAllSolicitudesReservaLaboratorioCerrado,
  inputGetReservaLaboratorioPorId,
  inputGetReservaLaboratorioPorUsuarioId,
  inputRechazarReservaLaboratorioCerrado,
  inputReservaLaboratorioCerrado,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { z } from "zod";
import { informacionUsuario } from "../usuario-helper";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaLaboratorioPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioCerradoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaLaboratorioCerrado.findMany({
    where: filtrosWhereReservaLaboratorioCerrado,
    include: {
      reserva: true,
      laboratorio: true,
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });

  return reservas;
};

type InputGetPorId = z.infer<typeof inputGetReservaLaboratorioPorId>;
export const getReservaPorId = async (ctx: { db: PrismaClient }, input: InputGetPorId) => {
  const { id } = input;

  const reserva = await ctx.db.reservaLaboratorioCerrado.findUnique({
    where: {
      reservaId: id,
    },
    include: {
      reserva: true,
      laboratorio: true,
    },
  });

  return reserva;
};

type InputGetAllReservas = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAllReservas, userId: string) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy, estatus, filtrByUserId } = input;

  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioCerradoWhereInput = {
    reserva: {
      ...(filtrByUserId === "true" ? { usuarioSolicitoId: userId } : {}),
      ...(estatus ? { estatus: estatus } : {}),
    },
    ...(searchText
      ? {
          OR: [
            {
              reserva: {
                reservaLaboratorioAbierto: {
                  laboratorio: {
                    nombre: {
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

  const orden: Prisma.ReservaLaboratorioAbiertoOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  const [count, reservas] = await ctx.db.$transaction([
    ctx.db.reservaLaboratorioCerrado.count({
      where: filtrosWhereReservaLaboratorioCerrado,
    }),
    ctx.db.reservaLaboratorioCerrado.findMany({
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
        laboratorio: true,
      },
      where: filtrosWhereReservaLaboratorioCerrado,
      orderBy: orden,
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    reservas,
  };
};

type InputAprobarReserva = z.infer<typeof inputAprobarReservaLaboratorioCerradoSchema>;
export const aprobarReserva = async (ctx: { db: PrismaClient }, input: InputAprobarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        include: {
          usuarioSolicito: true,
          usuarioAprobador: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "FINALIZADA",
          usuarioAprobadorId: userId,
          fechaAprobacion: new Date(),
          reservaLaboratorioCerrado: {
            update: {
              laboratorioId: input.laboratorioId,
              usuarioModificadorId: userId,
            },
          },
        },
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error aprobando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputRechazarReserva = z.infer<typeof inputRechazarReservaLaboratorioCerrado>;
export const rechazarReserva = async (ctx: { db: PrismaClient }, input: InputRechazarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        include: {
          usuarioSolicito: true,
          usuarioAprobador: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "RECHAZADA",
          usuarioRechazadoId: userId,
          fechaRechazo: new Date(),
          reservaLaboratorioCerrado: {
            update: {
              usuarioModificadorId: userId,
              laboratorioId: null,
            },
          },
        },
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputEditarReserva = z.infer<typeof inputEditarReservaLaboratorioCerradoSchema>;
export const editarReserva = async (ctx: { db: PrismaClient }, input: InputEditarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          usuarioSolicitoId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await tx.reservaLaboratorioCerrado.delete({
        where: {
          reservaId: input.id,
        },
      });

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        ...getReservaCerradaCreateArgs(input, userId),
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

export const cancelarReserva = async (ctx: { db: PrismaClient }, input: InputRechazarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          usuarioSolicitoId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      if (reserva.usuarioCreadorId === userId || reserva.usuarioSolicitoId === userId) {
        await tx.reserva.update({
          where: {
            id: input.id,
          },
          data: {
            estatus: "CANCELADA",
            usuarioModificadorId: userId,
            reservaLaboratorioCerrado: {
              update: {
                usuarioModificadorId: userId,
                laboratorioId: null,
              },
            },
          },
        });

        return reserva;
      }
      throw new Error("No tienes permisos para cancelar esta reserva");
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputCrearReserva = z.infer<typeof inputReservaLaboratorioCerrado>;
export const crearReservaLaboratorioCerrado = async (
  ctx: { db: PrismaClient },
  input: InputCrearReserva,
  userId: string,
) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.create({
        ...getReservaCerradaCreateArgs(input, userId),
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva. ${(error as Error).message ?? ""}`);
  }
};

const getReservaCerradaCreateArgs = (input: InputCrearReserva, userId: string) => {
  return {
    data: {
      estatus: "PENDIENTE",
      fechaHoraInicio: new Date(`${input.fechaReserva}T${input.horaInicio}`),
      fechaHoraFin: new Date(`${input.fechaReserva}T${input.horaFin}`),
      tipo: "LABORATORIO_CERRADO",
      usuarioSolicitoId: userId,
      usuarioCreadorId: userId,
      usuarioModificadorId: userId,
      reservaLaboratorioCerrado: {
        create: {
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
          laboratorioId: null,
          cursoId: input.cursoId,
          //TODO EQUIPO RESERVADO
        },
      },
    },
  } as Prisma.ReservaCreateArgs;
};
