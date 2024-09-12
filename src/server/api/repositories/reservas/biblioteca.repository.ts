import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { type inputGetReservaLibroPorUsuarioId } from "@/shared/filters/reservas-filter.schema";

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
