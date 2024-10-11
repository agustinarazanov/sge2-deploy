import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { z } from "zod";
import { informacionUsuario } from "../usuario-helper";
import type {
  inputEditarReservaLaboratorioAbiertoSchema,
  inputAprobarReservaLaboratorioAbiertoSchema,
  inputReservaLaboratorioAbierto,
  inputGetAllSolicitudesReservaLaboratorioAbierto,
  inputGetReservaLaboratorioPorId,
  inputGetReservaLaboratorioPorUsuarioId,
  inputRechazarReservaLaboratorioAbierto,
  inputCancelarReservaLaboratorioAbierto,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import { armarFechaReserva } from "@/shared/get-date";
import { lanzarErrorSiLaboratorioOcupado } from "./laboratorioEnUso.repository";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaLaboratorioPorUsuarioId>;
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

  const orden: Prisma.ReservaLaboratorioAbiertoOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

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
            usuarioTutor: {
              select: informacionUsuario,
            },
          },
        },
        laboratorio: true,
      },
      where: filtrosWhereReservaLaboratorioAbierto,
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

type InputGetById = z.infer<typeof inputGetReservaLaboratorioPorId>;
export const getReservaPorId = async (ctx: { db: PrismaClient }, input: InputGetById) => {
  const { id } = input;

  const reserva = await ctx.db.reservaLaboratorioAbierto.findUnique({
    where: {
      reservaId: id,
    },
    include: {
      sede: true,
      reserva: {
        include: {
          usuarioTutor: {
            select: informacionUsuario,
          },
        },
      },
      laboratorio: true,
      equipoReservado: {
        select: {
          equipoId: true,
          cantidad: true,
          equipoTipo: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
  });

  return reserva;
};

type InputAprobarORechazarReserva = z.infer<typeof inputAprobarReservaLaboratorioAbiertoSchema>;
export const aprobarReserva = async (
  ctx: { db: PrismaClient },
  input: InputAprobarORechazarReserva,
  userId: string,
) => {
  try {
    const laboratorioId = input.laboratorioId ? Number(input.laboratorioId) : undefined;

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
        throw new Error("La reserva ya se encuentra cancelada");
      }

      await lanzarErrorSiLaboratorioOcupado(
        { db: tx },
        {
          fechaHoraInicio: reserva.fechaHoraInicio,
          fechaHoraFin: reserva.fechaHoraFin,
          laboratorioId: laboratorioId,
          excepcionReservaId: reserva.id,
        },
      );

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          usuarioAprobadorId: userId,
          estatus: "FINALIZADA",
          fechaAprobacion: new Date(),
          usuarioTutorId: input.tutorId ? input.tutorId : null,
          reservaLaboratorioAbierto: {
            update: {
              laboratorioId: laboratorioId ?? null,
              usuarioModificadorId: userId,
              equipoReservado: {
                deleteMany: {},
                createMany: {
                  data: input.equipoReservado.map((equipo) => ({
                    cantidad: equipo.cantidad,
                    equipoId: equipo.equipoId,
                    usuarioCreadorId: userId,
                    usuarioModificadorId: userId,
                  })),
                },
              },
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

type InputEditarReservaLaboratorioAbierto = z.infer<typeof inputEditarReservaLaboratorioAbiertoSchema>;
export const editarReserva = async (
  ctx: { db: PrismaClient },
  input: InputEditarReservaLaboratorioAbierto,
  userId: string,
) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("La reserva no existe");
      }

      if (reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya está cancelada");
      }

      if (reserva.usuarioCreadorId !== userId) {
        throw new Error("No es el creador de la reserva");
      }

      await tx.reservaLaboratorioAbierto.delete({
        where: {
          reservaId: input.id,
        },
      });

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        ...getReservaAbiertaCreateArgs(input, userId),
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error editando reserva. ${(error as Error).message ?? ""}`);
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

      if (reserva.estatus === "CANCELADA" || reserva.estatus === "RECHAZADA") {
        throw new Error("La reserva ya está cancelada o rechazada");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          usuarioRechazadoId: userId,
          estatus: "RECHAZADA",
          fechaRechazo: new Date(),
          usuarioTutorId: null,
          motivoRechazo: input.motivo,
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

type InputCancelarReservaLaboratorioAbierto = z.infer<typeof inputCancelarReservaLaboratorioAbierto>;
export const cancelarReserva = async (
  ctx: { db: PrismaClient },
  input: InputCancelarReservaLaboratorioAbierto,
  userId: string,
) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("La reserva no existe");
      }

      if (reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya está cancelada");
      }

      if (reserva.usuarioCreadorId !== userId) {
        throw new Error("No es el creador de la reserva");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "CANCELADA",
          usuarioModificadorId: userId,
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error cancelando reserva. ${(error as Error).message ?? ""}`);
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
      ...getReservaAbiertaCreateArgs(input, userId),
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva`);
  }
};

const getReservaAbiertaCreateArgs = (input: InputCrearReservaLaboratorioAbierto, userId: string) => {
  return {
    data: {
      estatus: "PENDIENTE",
      fechaHoraInicio: armarFechaReserva(input.fechaReserva, input.horaInicio),
      fechaHoraFin: armarFechaReserva(input.fechaReserva, input.horaFin),
      tipo: "LABORATORIO_ABIERTO",
      reservaLaboratorioAbierto: {
        create: {
          sedeId: Number(input.sedeId),
          laboratorioId: null,
          laboratorioAbiertoTipo: input.tipo,
          descripcion: input.observaciones?.trim() ?? "",
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
          especialidad: input.especialidad ?? "",
          concurrentes: input.concurrentes ?? 1,
          equipoReservado: {
            createMany: {
              data: input.equipoReservado.map((equipo) => ({
                cantidad: equipo.cantidad,
                equipoId: equipo.equipoId,
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
  } as Prisma.ReservaCreateArgs;
};
