import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import type {
  inputAprobarORechazarSolicitudReservaLaboratorioAbierto,
  inputGetAllSolicitudesReservaLaboratorioAbierto,
  inputGetReservaPorId,
  inputGetReservaPorUsuarioId,
} from "@/shared/filters/reservas-filter.schema";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { z } from "zod";
import { informacionUsuario } from "../usuario-helper";
import { inputReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

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
      id: id,
    },
    include: {
      reserva: true,
      laboratorio: true,
      equipoReservado: true,
    },
  });

  return reserva;
};

type InputAprobarORechazarReserva = z.infer<typeof inputAprobarORechazarSolicitudReservaLaboratorioAbierto>;
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
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error aprobando reserva`);
  }
};

export const rechazarReserva = async (
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
          usuarioRechazadoId: userId,
          estatus: "CANCELADA",
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva`);
  }
};

type InputCrearReservaLaboratorioAbierto = z.infer<typeof inputReservaLaboratorioAbierto>;
export const crearReservaLaboratorioAbierto = async (
  ctx: { db: PrismaClient },
  input: InputCrearReservaLaboratorioAbierto,
  userId: string,
) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.create({
        data: {
          usuarioSolicitoId: userId,
          estatus: "PENDIENTE",
          // todo pasar input.horaInicio y input.horaFin a fechaHoraInicio y fechaHoraFin
          fechaHoraInicio: new Date(input.fechaReserva),
          fechaHoraFin: new Date(input.fechaReserva),
          tipo: "LABORATORIO_ABIERTO",
          usuarioAprobadorId: userId,
          usuarioRechazadoId: null,
          reservaLaboratorioAbierto: {
            create: {
              laboratorioId: 0,
              descripcion: input.observaciones?.trim() ?? "",
              usuarioCreadorId: userId,
              usuarioModificadorId: userId,
              mailConfirmado: false,
              especialidad: "",
              numeroReserva: 123456, // TODO: que dato va aca?
              fechaCreacion: new Date(),
              fechaModificacion: new Date(),
            },
          },
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
        },
      });

      if (input.equipoRequerido.length > 0) {
        for (const equipo of input.equipoRequerido) {
          await tx.reservaLaboratorioAbiertoEquipo.create({
            data: {
              cantidad: equipo.cantidad,
              equipoId: parseInt(equipo.idTipo),
              reservaLaboratorioAbiertoId: reserva.id,
              usuarioCreadorId: userId,
              usuarioModificadorId: userId,
            },
          });
        }
      }

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva`);
  }
};
