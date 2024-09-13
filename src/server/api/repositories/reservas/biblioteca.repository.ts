import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { inputPrestarLibro, type inputGetReservaLibroPorUsuarioId } from "@/shared/filters/reservas-filter.schema";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaLibroPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;
  const reservas = await ctx.db.reservaLibro.findMany({
    include: {
      reserva: true,
      libro: true,
    },
    where: {
      usuarioCreadorId: id,
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
              fechaEntregado: new Date(), // input.fechaEntregado,
              libroId: input.libroId,
              usuarioCreadorId: userId,
              usuarioModificadorId: userId,
            },
          },

          estatus: "PENDIENTE",
          fechaHoraInicio: new Date(), // input.fechaInicio,
          fechaHoraFin: new Date(), //input.fechaFin,
          tipo: "LIBRO",

          fechaAprobacion: new Date(),

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
