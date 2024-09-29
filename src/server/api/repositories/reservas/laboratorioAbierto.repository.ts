import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import type {
  inputGetAllSolicitudesReservaLaboratorioAbierto,
  inputGetReservaPorId,
  inputGetReservaPorUsuarioId,
  inputRechazarReservaLaboratorioAbierto,
} from "@/shared/filters/reservas-filter.schema";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { z } from "zod";
import { informacionUsuario } from "../usuario-helper";
import {
  type inputAprobarReservaSchema,
  type inputReservaLaboratorioAbierto,
} from "@/shared/filters/reserva-laboratorio-filter.schema";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaLaboratorioAbierto: Prisma.ReservaLaboratorioAbiertoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaLaboratorioAbierto.findMany({
    where: filtrosWhereReservaLaboratorioAbierto,
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

type InputGetAll = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAll, userId: string) => {
  const { pageIndex, pageSize, searchText, orderDirection, orderBy, estatus, filtrByUserId } = input;

  const filtrosWhereReservaLaboratorioAbierto: Prisma.ReservaLaboratorioAbiertoWhereInput = {
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

  console.log({
    input,
    filtrosWhereReservaLaboratorioAbierto,
  });

  const ordenLibro: Prisma.ReservaLaboratorioAbiertoOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  console.log({ filtrosWhereReservaLaboratorioAbierto, userId });

  const [count, reservas] = await ctx.db.$transaction([
    ctx.db.reservaLaboratorioAbierto.count({
      where: filtrosWhereReservaLaboratorioAbierto,
    }),
    ctx.db.reservaLaboratorioAbierto.findMany({
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
      where: filtrosWhereReservaLaboratorioAbierto,
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

type InputGetById = z.infer<typeof inputGetReservaPorId>;
export const getReservaPorId = async (ctx: { db: PrismaClient }, input: InputGetById) => {
  const { id } = input;

  const reserva = await ctx.db.reservaLaboratorioAbierto.findUnique({
    where: {
      reservaId: id,
    },
    include: {
      reserva: {
        include: {
          usuarioTutor: true,
        },
      },
      laboratorio: true,
      equipoReservado: true,
    },
  });

  return reserva;
};

type InputAprobarORechazarReserva = z.infer<typeof inputAprobarReservaSchema>;
export const aprobarReserva = async (
  ctx: { db: PrismaClient },
  input: InputAprobarORechazarReserva,
  userId: string,
) => {
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
        throw new Error("La reserva no existe");
      }

      if (reserva.estatus !== "PENDIENTE") {
        throw new Error("La reserva no está pendiente");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          usuarioAprobadorId: userId,
          estatus: "FINALIZADA",
          fechaAprobacion: new Date(),
          usuarioTutorId: input.tutorId,
          reservaLaboratorioAbierto: {
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
    throw new Error(`Error aprobando reserva`);
  }
};

type InputRechazarReservaLaboratorioAbierto = z.infer<typeof inputRechazarReservaLaboratorioAbierto>;
export const rechazarReserva = async (
  ctx: { db: PrismaClient },
  input: InputRechazarReservaLaboratorioAbierto,
  userId: string,
) => {
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
        throw new Error("La reserva no existe");
      }

      if (reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya está cancelada");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          usuarioRechazadoId: userId,
          estatus: "CANCELADA",
          fechaRechazo: new Date(),
          usuarioTutorId: null,
          reservaLaboratorioAbierto: {
            update: {
              laboratorioId: null,
              usuarioModificadorId: userId,
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

type InputCrearReservaLaboratorioAbierto = z.infer<typeof inputReservaLaboratorioAbierto>;
export const crearReservaLaboratorioAbierto = async (
  ctx: { db: PrismaClient },
  input: InputCrearReservaLaboratorioAbierto,
  userId: string,
) => {
  try {
    const reserva = await ctx.db.reserva.create({
      data: {
        estatus: "PENDIENTE",
        fechaHoraInicio: new Date(`${input.fechaReserva}T${input.horaInicio}`),
        fechaHoraFin: new Date(`${input.fechaReserva}T${input.horaFin}`),
        tipo: "LABORATORIO_ABIERTO",
        reservaLaboratorioAbierto: {
          create: {
            laboratorioId: null,
            descripcion: input.observaciones?.trim() ?? "",
            usuarioCreadorId: userId,
            usuarioModificadorId: userId,
            especialidad: input.especialidad ?? "",
            equipoReservado: {
              createMany: {
                data: input.equipoRequerido.map((equipo) => ({
                  cantidad: equipo.cantidad,
                  equipoId: parseInt(equipo.idTipo),
                  usuarioCreadorId: userId,
                  usuarioModificadorId: userId,
                })),
              },
            },
          },
        },
        usuarioSolicitoId: userId,
        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
      },
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva`);
  }
};
